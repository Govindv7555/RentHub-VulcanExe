# RentHub-VulcanExe

32-hour hackathon · 3-person team · Govind, Sidhu, Denny

## What we're building

RentHub is a peer-to-peer marketplace in India where people rent home, garden and construction tools from each other. A trust stack (KYC, escrow deposit, micro-insurance, photo-verified handovers, reputation score) makes lending to a stranger safe.

## Current status

**Working**
- Supabase project created for RentHub
- `schema.sql` applied in the Supabase SQL Editor: tables live, RLS enabled, `public_identity` view live
- Three storage buckets: `renthub-uploads` (private), `handover-photos` (private), `listing-photos` (public)
- Handoff files added to the repo root: `HANDOFF.md`, `spec.yaml`, `schema.sql`, `updatelog.yaml` (iteration 4 pushed)
- Site deployed on Vercel

**Known issue**
- Vercel Deployment Protection redirects everyone except the owner's laptops to the Vercel login page. Turn it off (or share a bypass link) before anyone else tests or the judges see it.

**Scope decisions**
- KYC / trust flow is mock-only for the hackathon: the frontend shows it, the backend has thin stubs.
- Real integrations from the pitch (Aadhaar/DigiLocker KYC, Razorpay escrow, Acko insurance, Twilio SMS) are stretch goals, not MVP.

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | React + Vite |
| Backend | Thin API + Supabase (Postgres, storage) |
| Hosting | Vercel (frontend and backend hosted by the backend dev) |

## Structure

| Folder / file | Owner | Contains |
| --- | --- | --- |
| `frontend/` | TBD | UI, screens, styling |
| `backend/` | TBD | endpoints, database, auth |
| `core/` | TBD | core logic / AI |
| `HANDOFF.md`, `spec.yaml`, `schema.sql`, `updatelog.yaml` | Backend | Frontend/backend handoff, API contract, DB schema, change log |

Don't edit a folder that isn't yours — ask the owner instead.

## Ports (fixed — everyone uses these)

- frontend → 3000 (set `server.port` to 3000 in `vite.config`; Vite defaults to 5173)
- backend → 8000

## Setup

1. `git clone https://github.com/Govindv7555/RentHub-VulcanExe.git`
2. Get `.env.local` from the backend dev (Supabase keys) or copy `.env.example` to `.env.local` and fill in the values
3. Terminal 1: start the backend on port 8000
4. Terminal 2: start the frontend on port 3000
5. Open http://localhost:3000

## Data contract

The source of truth is `spec.yaml` (API requests/endpoints) and `schema.sql` (database). Changing either requires telling the whole team, and every change gets an entry in `updatelog.yaml`.

## Rules

- `main` always works. Never push broken code to it.
- Push small, push often — every time something works, even if ugly.
- Never commit `.env`, `.env.local` or real API keys.
- Commit the lockfile so all three machines match.

## The 32-hour clock

| Hour | Target |
| --- | --- |
| 1 | One-liner, lanes, and data contract locked |
| 5 | Ugliest possible end-to-end version working |
| 14 | The feature that impresses judges; backend deployed |
| 22 | Feature freeze — Demo Owner takes over integration |
| 26 | Deployed and rehearsed once |
| 29 | Buffer for the thing that will break |
| 31 | Final rehearsal on the demo machine, then submit |
