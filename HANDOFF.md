# KiraMart — START HERE

This repo has three files that both the frontend and backend models must
read to stay in sync. Read them in this order, at these intervals:

| # | File | Read when | Read how much |
|---|------|-----------|----------------|
| 1 | `spec.yaml` | Once, at the very start of the project | In full |
| 2 | `schema.sql` | Whenever touching persistence (queries, new columns) | Just the table(s) you need |
| 3 | `updatelog.yaml` | **Every iteration, before writing any code** | In full — it's short by design |

## The one rule

Never edit `spec.yaml` or `schema.sql` without appending an entry to
`updatelog.yaml` in the same commit. `updatelog.yaml` is what lets everyone
skip re-reading the long files every time — it tells you exactly which
section of which file changed, so you only open what you need.

## After step 1

You don't re-read `spec.yaml` and `schema.sql` top to bottom again. You:
1. Read `updatelog.yaml` in full.
2. If an entry names a section relevant to what you're about to build,
   jump to that section in `spec.yaml` or `schema.sql`.
3. Do the work.
4. If you changed a shape, endpoint, or table — edit the file, then
   append a new entry to `updatelog.yaml`, same commit.

## What's in each file

- **`spec.yaml`** — the API contract: every endpoint, request/response
  shape, state machines, error codes, and the full trust-flow (mocked
  KYC/face-match/eSign) spec including legal basis and privacy rules.
- **`schema.sql`** — the database contract: Postgres/Supabase DDL for
  every table, the booking state-machine trigger, and RLS setup.
- **`updatelog.yaml`** — append-only change log, read in full every
  session, tells you what changed since you last looked and which file
  to open for detail.
- **`.env.example`** — read once, at local setup, to know which Supabase
  keys to request (never commit real keys).
