-- =============================================================================
-- KIRAMART — schema.sql
-- Full Postgres schema (Supabase). This is the DATABASE CONTRACT, matching
-- spec.yaml's API CONTRACT. Read both — spec.yaml says what the API returns,
-- this says what's actually stored. If you change a column here, update the
-- matching response shape in spec.yaml AND append an entry to updatelog.yaml
-- in the same commit.
--
-- Apply as a Supabase migration: supabase/migrations/0001_init.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- USERS  (Supabase auth.users holds login; this is the app-facing profile)
-- -----------------------------------------------------------------------------
create table users (
  id            uuid primary key references auth.users(id),
  phone_masked  text not null,
  name          text not null,
  kyc_verified  boolean not null default false,
  rating_avg    numeric(2,1) not null default 0,   -- denormalized, updated by trigger on ratings insert
  rating_count  integer not null default 0,
  created_at    timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- TRUST FLOW — matches spec.yaml `trust.data_model`
-- -----------------------------------------------------------------------------
create table kyc_sessions (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references users(id),
  status            text not null default 'pending' check (status in ('pending','verified','failed')),
  provider          text not null default 'mock' check (provider in ('mock','setu')),
  consent_timestamp timestamptz,
  consent_ip        text,
  created_at        timestamptz not null default now()
);

-- Never a full Aadhaar number in this table. Enforced by convention + code review,
-- not by a DB constraint (a constraint can't tell a real number from a fake one).
create table identity_records (
  user_id       uuid primary key references users(id),
  name          text not null,
  dob           date not null,
  gender        text,
  address_hash  text not null,        -- hash only, never raw address
  aadhaar_last4 text not null,        -- last 4 digits only
  verified_badge boolean not null default false,
  created_at    timestamptz not null default now()
);
-- RLS: an owner can read another user's name + verified_badge ONLY, never
-- dob/address_hash/aadhaar_last4. Enforce via a view, not by relaxing this table's RLS:
create view public_identity as
  select user_id, name, verified_badge from identity_records;

-- -----------------------------------------------------------------------------
-- LISTINGS
-- -----------------------------------------------------------------------------
create table listings (
  id                    uuid primary key default gen_random_uuid(),
  owner_id              uuid not null references users(id),
  title                 text not null,
  description           text,
  category              text not null check (category in
                          ('construction','garden','home_repair','plumbing','electrical','cleaning')),
  declared_value_paise  integer not null check (declared_value_paise > 0),
  price_per_day_paise   integer not null check (price_per_day_paise > 0),
  photos                text[] not null default '{}',
  lat                   double precision,
  lng                   double precision,
  address               text,
  status                text not null default 'draft' check (status in ('draft','active','paused','archived')),
  created_at            timestamptz not null default now()
);

create table listing_availability (
  listing_id  uuid not null references listings(id),
  date        date not null,
  available   boolean not null default true,
  primary key (listing_id, date)
);

-- -----------------------------------------------------------------------------
-- BOOKINGS — status order matches spec.yaml state_machines.booking
-- -----------------------------------------------------------------------------
create table bookings (
  id                        uuid primary key default gen_random_uuid(),
  listing_id                uuid not null references listings(id),
  owner_id                  uuid not null references users(id),
  renter_id                 uuid not null references users(id),
  status                    text not null default 'draft' check (status in
                              ('draft','kyc_verified','contract_signed','deposit_held',
                               'handover_confirmed','active','return_confirmed','settled','disputed')),
  start_date                date not null,
  end_date                  date not null,
  rental_fee_paise          integer not null,
  platform_fee_paise        integer not null,       -- 15% of rental_fee_paise
  insurance_premium_paise   integer not null,
  deposit_paise             integer not null,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

-- Enforce the state machine in the DB, not just in app code — a trigger
-- rejects any UPDATE that skips a step. See spec.yaml state_machines.booking.
create or replace function check_booking_transition() returns trigger as $$
declare
  allowed_next text[];
begin
  allowed_next := case old.status
    when 'draft'               then array['kyc_verified','cancelled']
    when 'kyc_verified'        then array['contract_signed','cancelled']
    when 'contract_signed'     then array['deposit_held','cancelled']
    when 'deposit_held'        then array['handover_confirmed']
    when 'handover_confirmed'  then array['active','disputed']
    when 'active'               then array['return_confirmed','disputed']
    when 'return_confirmed'    then array['settled','disputed']
    when 'disputed'            then array['settled']
    else array[]::text[]
  end;
  if new.status <> old.status and not (new.status = any(allowed_next)) then
    raise exception 'invalid booking transition: % -> %', old.status, new.status;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_booking_transition
  before update of status on bookings
  for each row execute function check_booking_transition();

-- -----------------------------------------------------------------------------
-- CONTRACTS / eSIGN — matches spec.yaml trust.data_model
-- -----------------------------------------------------------------------------
create table contracts (
  id             uuid primary key default gen_random_uuid(),
  booking_id     uuid not null references bookings(id),
  pdf_url        text,
  document_hash  text,
  status         text not null default 'draft' check (status in ('draft','signed')),
  created_at     timestamptz not null default now()
);

create table contract_signatures (
  id                uuid primary key default gen_random_uuid(),
  contract_id       uuid not null references contracts(id),
  signer_user_id    uuid not null references users(id),
  signed_at         timestamptz not null default now(),
  certificate_meta  jsonb    -- mock cert details only; never a fabricated real-CA identity
);

-- -----------------------------------------------------------------------------
-- HANDOVER / RETURN EVIDENCE
-- -----------------------------------------------------------------------------
create table handover_evidence (
  id            uuid primary key default gen_random_uuid(),
  booking_id    uuid not null references bookings(id),
  photo_url     text not null,
  photo_sha256  text not null,
  captured_by   text not null check (captured_by in ('owner','renter')),
  stage         text not null check (stage in ('handover','return')),
  captured_at   timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- PAYMENTS / DEPOSIT ESCROW  (mocked provider, real-shaped table)
-- -----------------------------------------------------------------------------
create table payments (
  id                    uuid primary key default gen_random_uuid(),
  booking_id            uuid not null references bookings(id),
  escrow_ref            text not null,
  provider              text not null default 'mock' check (provider in ('mock','razorpay')),
  amount_paise          integer not null,
  deposit_paise         integer not null,
  deposit_released_at   timestamptz,
  amount_withheld_paise integer not null default 0,
  created_at            timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- DISPUTES
-- -----------------------------------------------------------------------------
create table disputes (
  id             uuid primary key default gen_random_uuid(),
  booking_id     uuid not null references bookings(id),
  raised_by      uuid not null references users(id),
  reason         text not null,
  status         text not null default 'open' check (status in ('open','resolved')),
  outcome        text,
  deposit_split  jsonb,
  created_at     timestamptz not null default now(),
  resolved_at    timestamptz
);

-- -----------------------------------------------------------------------------
-- RATINGS
-- -----------------------------------------------------------------------------
create table ratings (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid not null references bookings(id),
  rated_user   uuid not null references users(id),  -- who is being rated
  rater_user   uuid not null references users(id),
  stars        integer not null check (stars between 1 and 5),
  comment      text,
  created_at   timestamptz not null default now()
);

create or replace function update_user_rating() returns trigger as $$
begin
  update users set
    rating_count = rating_count + 1,
    rating_avg = round(((rating_avg * rating_count) + new.stars) / (rating_count + 1), 1)
  where id = new.rated_user;
  return new;
end;
$$ language plpgsql;

create trigger trg_rating_insert
  after insert on ratings
  for each row execute function update_user_rating();

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY — enable everywhere, deny by default, add policies
-- as you build. Listed here so it isn't forgotten under hackathon time
-- pressure; write the actual policies per table as you implement each route.
-- -----------------------------------------------------------------------------
alter table users enable row level security;
alter table identity_records enable row level security;
alter table listings enable row level security;
alter table bookings enable row level security;
alter table contracts enable row level security;
alter table contract_signatures enable row level security;
alter table handover_evidence enable row level security;
alter table payments enable row level security;
alter table disputes enable row level security;
alter table ratings enable row level security;
