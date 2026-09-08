# Zoom Clone — Video Conferencing Platform

A functional video conferencing web application designed to replicate the modern Zoom Meeting Platform. This platform enables users to create, join, and schedule meetings within a clean, professional interface. 

Everything is functional—instant meeting creation, scheduled meetings, unique meeting IDs, join by link, real-time presence (mocked/simulated), and interactive dashboards.

## Contents
- [Quick start](#quick-start)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Database schema](#database-schema)
- [API overview](#api-overview)
- [Edge cases and how they are handled](#edge-cases-and-how-they-are-handled)
- [Deployment](#deployment)
- [Assumptions](#assumptions)
- [Project layout](#project-layout)

## Quick start

Requires Python 3.11+ and Node 20+. The application comes with scripts to start both frontend and backend concurrently.

**Mac/Linux**
```bash
git clone https://github.com/Awesome06/zoom-clone-fullstack.git
cd zoom-clone-fullstack
chmod +x start.sh
./start.sh
```

**Windows**
```cmd
git clone https://github.com/Awesome06/zoom-clone-fullstack.git
cd zoom-clone-fullstack
start.bat
```

### Signing in
Authentication is currently mocked: a default user is automatically logged in upon starting the application to focus on core meeting functionality. The database is seeded with initial sample data to populate the upcoming and recent meetings lists upon initialization.

## Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS, lucide-react |
| Backend | Python, FastAPI, SQLAlchemy 2.0 |
| Database | SQLite |
| Scheduling | APScheduler (for periodic cleanup) |

## Architecture

```text
┌──────────────────────────── Browser ────────────────────────────┐
│                        Next.js App (SPA)                        │
│                                                                 │
│   ├── UI Components (Dashboard, Modals, Forms)                  │
│   └── State Management / API Client (Fetch REST)                │
└───────────────┬─────────────────────────────────────────────────┘
                │ HTTP / REST
┌───────────────▼─────────────────────────────────────────────────┐
│                        FastAPI Backend                          │
│                                                                 │
│   ├── api/            REST endpoints (/api/meetings, etc.)      │
│   ├── core/           Business logic and scheduled tasks        │
│   └── models/         SQLAlchemy schema and constraints         │
└───────────────┬─────────────────────────────────────────────────┘
                │
┌───────────────▼────────────────┐
│             SQLite             │
└────────────────────────────────┘
```

Three decisions shape everything else:
1. **The database is the source of truth.** The backend interacts directly with the SQLite database through SQLAlchemy ORM, ensuring consistent state across requests.
2. **Scheduled Cleanup.** Meetings older than 1 day or ended meetings whose scheduled end time has passed are automatically pruned using an APScheduler cron job running nightly.
3. **Seeded Data for Immediate Use.** On startup, the `lifespan` event seeds the database with a default host user, 3 past meetings, and 3 upcoming meetings to populate the UI instantly without manual setup.

## Database schema

Three core tables handling the entities.

```text
users
├─ id PK
├─ name
├─ email UNIQUE
└─ created_at

meetings
├─ id PK
├─ meeting_id UNIQUE (e.g. 123-4567-890)
├─ title
├─ description
├─ host_id ─► users.id
├─ status 'scheduled' | 'active' | 'ended'
├─ is_instant BOOLEAN
├─ scheduled_start
├─ duration_minutes
├─ invite_link
└─ created_at

participants
├─ id PK
├─ meeting_id ─► meetings.id
├─ user_id ─► users.id, nullable
├─ display_name
├─ joined_at
└─ left_at, nullable

chat_messages
├─ id PK
├─ meeting_id ─► meetings.id
├─ sender_id ─► users.id, nullable
├─ sender_name
├─ content
└─ created_at
```

## API overview

All routes are prefixed with `/api`.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/meetings` | List upcoming and recent meetings |
| POST | `/api/meetings` | Schedule or create an instant meeting |
| GET | `/api/meetings/{meeting_id}` | Retrieve details of a specific meeting |
| PATCH | `/api/meetings/{meeting_id}` | Update meeting status (e.g., end meeting) |
| POST | `/api/participants` | Join a meeting |
| GET | `/api/participants/meeting/{meeting_id}` | List active participants in a meeting |

## Edge cases and how they are handled

| Case | Mechanism |
| --- | --- |
| Duplicate Meeting IDs | Uniqueness enforced at the DB level, backed by robust UUID-based generation. |
| Stale Meetings | Handled by an APScheduler cron job running nightly to prune old or ended meetings. |
| Instant Meeting Cleanup | Instantly ended meetings are immediately flagged for deletion in the next cleanup cycle. |
| First-time Boot | Startup scripts explicitly handle missing DB dependencies and populate initial tables. |

## Deployment

The application components are deployed independently:

- **Frontend Live Link:** [https://zoom-clone-fullstack-dsmn1.vercel.app/](https://zoom-clone-fullstack-dsmn1.vercel.app/)
- **Backend API Link:** [https://zoom-clone-backend-zhvw.onrender.com](https://zoom-clone-backend-zhvw.onrender.com)

*Note: As Render free tier spins down on inactivity, the initial backend request might take a few seconds.*

## Assumptions

- **Authentication:** Assume a default user is actively logged in; focus remains heavily on core functionality rather than robust authentication flows.
- **Data Seeding:** The database is seeded with initial sample data to populate the upcoming and recent meetings lists upon initialization.
- **AI Utilization:** AI assistants were utilized for scaffolding and boilerplate generation, with all implementation decisions thoroughly understood.

## Project layout

```text
.
├── backend/
│   ├── app/
│   │   ├── api/          API routing and endpoints
│   │   ├── core/         Config and DB setup
│   │   ├── models/       SQLAlchemy schemas
│   │   ├── schemas/      Pydantic request/response validation
│   │   └── main.py       App wiring, CORS, lifespan, cron jobs
│   ├── requirements.txt
│   └── pyproject.toml
├── frontend/
│   ├── src/
│   │   ├── app/          Next.js App Router (pages & layouts)
│   │   ├── components/   Reusable UI components (Dashboard, Modals)
│   │   ├── hooks/        Custom React hooks
│   │   └── lib/          API clients and utility functions
│   ├── tailwind.config.ts
│   └── package.json
├── scripts/              Startup scripts for Windows/Linux
│   ├── start.bat         Windows start script
│   ├── start.sh          Mac/Linux start script
└── README.md
```
