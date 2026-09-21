#RentHUb-VulcanExe

32-hour hackathon · 3-person team · Govind, Sidhu, Denny

## What we're building

_TBD — one line, fill this in before writing code._

## Structure

| Folder | Owner | Contains |
| --- | --- | --- |
| `frontend/` | TBD | UI, screens, styling |
| `backend/` | TBD | endpoints, database, auth |
| `core/` | TBD | core logic / AI |

Don't edit a folder that isn't yours — ask the owner instead.

## Ports (fixed — everyone uses these)

- frontend → 3000
- backend → 8000

## Setup

1. `git clone https://github.com/Govindv7555/Notdefined-VulcanExe.git`
2. `cp .env.example .env` and fill in the values
3. Terminal 1: start the backend on port 8000
4. Terminal 2: start the frontend on port 3000
5. Open http://localhost:3000

## Data contract

Changing this shape requires telling the whole team.

```json
{
  "endpoint": "POST /api/analyze",
  "request": { "text": "string" },
  "response": { "score": 0.0, "label": "string" }
}
```

## Rules

- `main` always works. Never push broken code to it.
- Push small, push often — every time something works, even if ugly.
- Never commit `.env` or real API keys.
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

Commit with the message "Set up team folder structure, env template, and README" and push to main.
