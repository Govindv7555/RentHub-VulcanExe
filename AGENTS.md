# RentHub agent rules

## Your role
I will tell you at the start of each session whether you are the
FRONTEND agent or the BACKEND agent. Work only in your own side's folder
(frontend/ or backend/). Changes to core/ must be logged in updatelog.yaml.

## Before writing any code
1. Read HANDOFF.md first and follow its read order exactly.
2. Read updatelog.yaml in full at the start of every session.
3. Read spec.yaml in full only the first time. After that, re-open only
   the sections that new updatelog.yaml entries name.
4. Open schema.sql only when you need a table or column detail.

## When you change something
- If you change spec.yaml or schema.sql, append an entry to updatelog.yaml
  in the same commit. Set `by:` to your side (frontend or backend).
- Never edit or delete past updatelog.yaml entries.
- If you change schema.sql, remind me to run the change in the Supabase
  SQL Editor too.

## Boundaries
- Frontend talks only to the API endpoints in spec.yaml, never to Postgres.
- Never use SUPABASE_SERVICE_ROLE_KEY in frontend code.
- Never commit .env.local or paste real keys into any file.
- Stub external services (Razorpay, KYC, insurance) with mock responses
  unless spec.yaml says otherwise.
