# Zoom Clone — Meeting Management Platform

A full-stack web application designed to replicate the core scheduling and management experience of the modern Zoom Meeting platform. This project enables users to create, join, and schedule meetings within a clean, professional interface. 

Everything related to meeting lifecycle management is functional—instant meeting creation, scheduled meetings, UUID-backed unique meeting IDs, join-by-link routing, and interactive user dashboards.

**Live Demo:** [Frontend Deployment](https://zoom-clone-fullstack-dsmn1.vercel.app/)  
**API Endpoint:** [Backend Render Instance](https://zoom-clone-backend-zhvw.onrender.com)  
*(Note: As Render's free tier spins down on inactivity, the initial backend request might take up to 30 seconds to wake up).*

## Contents
- [Quick start](#quick-start)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Database schema](#database-schema)
- [API overview](#api-overview)
- [Edge cases and how they are handled](#edge-cases-and-how-they-are-handled)
- [Future Roadmap](#future-roadmap)
- [Assumptions](#assumptions)
- [Project layout](#project-layout)

## Quick start
Requires Python 3.11+ and Node 20+. The application comes with scripts to start both the Next.js frontend and FastAPI backend concurrently.

### Mac/Linux
```bash
git clone [https://github.com/Awesome06/zoom-clone-fullstack.git](https://github.com/Awesome06/zoom-clone-fullstack.git)
cd zoom-clone-fullstack
chmod +x start.sh
./start.sh
```

### Windows
```cmd
git clone [https://github.com/Awesome06/zoom-clone-fullstack.git](https://github.com/Awesome06/zoom-clone-fullstack.git)
cd zoom-clone-fullstack
start.bat
```

## Tech stack

| Layer | Choice | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js (App Router), TypeScript, Tailwind CSS, lucide-react | Responsive SPA with modern React patterns |
| **Backend** | Python, FastAPI | High-performance, async REST API |
| **Database** | SQLite, SQLAlchemy 2.0 | Lightweight, robust relational data storage |
| **Scheduling** | APScheduler | Background cron jobs for database cleanup |

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
                │ Internal API
┌───────────────▼────────────────┐
│             SQLite             │
└────────────────────────────────┘
```

Three core decisions shape the system architecture:
1. **The Database is the Source of Truth:** The backend interacts directly with the SQLite database through SQLAlchemy ORM, ensuring consistent state across all client requests.
2. **Scheduled Cleanup Pipelines:** Meetings older than 1 day, or ended meetings whose scheduled end time has passed, are automatically pruned using an APScheduler cron job running nightly.
3. **Seeded Data for Immediate Use:** On startup, FastAPI lifespan events seed the database with a default host user, 3 past meetings, and 3 upcoming meetings to instantly populate the UI without manual setup.

## Database schema

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
├─ user_id ─► users.id (nullable)
├─ display_name
├─ joined_at
└─ left_at (nullable)

chat_messages
├─ id PK
├─ meeting_id ─► meetings.id
├─ sender_id ─► users.id (nullable)
├─ sender_name
├─ content
└─ created_at
```

## API overview
All routes are prefixed with `/api`.

| Method | Path | Purpose |
| :--- | :--- | :--- |
| `GET` | `/api/meetings` | List upcoming and recent meetings |
| `POST` | `/api/meetings` | Schedule or create an instant meeting |
| `GET` | `/api/meetings/{meeting_id}` | Retrieve details of a specific meeting |
| `PATCH` | `/api/meetings/{meeting_id}` | Update meeting status (e.g., end meeting) |
| `POST` | `/api/participants` | Join a meeting |
| `GET` | `/api/participants/meeting/{id}`| List active participants in a meeting |

## Edge cases and how they are handled

| Case | Mechanism |
| :--- | :--- |
| **Duplicate Meeting IDs** | Uniqueness is strictly enforced at the DB level, backed by robust UUID-based generation logic on the backend. |
| **Stale Meetings** | Handled by a background `APScheduler` cron job running nightly to prune old or ended meetings to prevent DB bloat. |
| **Instant Meeting Cleanup** | Instantly ended meetings are immediately flagged for deletion in the next cleanup cycle. |
| **First-time Boot** | Startup scripts explicitly handle missing DB dependencies and execute the lifespan seeder safely. |

## Future Roadmap
Currently, real-time presence and video feeds are simulated to focus on the core REST architecture and scheduling logic. Future iterations will include:
* **WebRTC Integration:** For peer-to-peer, low-latency video and audio streaming.
* **WebSockets (Socket.io/FastAPI WebSockets):** To replace HTTP polling for real-time chat, participant join/leave events, and live presence updates.

## Assumptions
- **Authentication:** To streamline the demo experience, authentication is mocked. A default user is automatically logged in upon starting the application so reviewers can focus strictly on core meeting functionality.
- **Data Seeding:** The database intentionally populates sample data on initialization so the dashboard is immediately interactive.

## Project layout

```text
.
├── backend/
│   ├── app/
│   │   ├── api/          # API routing and endpoints
│   │   ├── core/         # Config, DB setup, and cron jobs
│   │   ├── models/       # SQLAlchemy schemas
│   │   ├── schemas/      # Pydantic request/response validation
│   │   └── main.py       # App wiring, CORS, and lifespan events
│   ├── requirements.txt
│   └── pyproject.toml
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js App Router (pages & layouts)
│   │   ├── components/   # Reusable UI components (Dashboard, Modals)
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # API clients and utility functions
│   ├── tailwind.config.ts
│   └── package.json
├── scripts/              # Startup wrappers for Windows/Linux
│   ├── start.bat
│   ├── start.sh
└── README.md
```

---

## Contact
**Mrigank Bhatnagar**  
* [LinkedIn](https://linkedin.com/in/mrigank-bhatnagar)
* [GitHub](https://github.com/Awesome06)
