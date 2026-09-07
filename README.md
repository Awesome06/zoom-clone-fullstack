# Zoom Clone - Scaler SDE Fullstack Assignment

A functional video conferencing web application designed to replicate the modern Zoom Meeting Platform. This platform enables users to create, join, and schedule meetings within a clean, professional interface. 

## Core Features
*   **Landing Dashboard:** Clean professional Zoom UI with a navigation bar, profile placeholders, and buttons for new, join, and scheduled meetings.
*   **Instant Meeting Creation:** Instantly generates a unique Meeting ID and shareable invite link, redirecting the user directly to the meeting room.
*   **Join Meeting:** Allows users to join active rooms using a Meeting ID or invite link after entering a display name.
*   **Schedule Meetings:** Features a date and time picker to schedule meetings, auto-generate links, and display them in the Upcoming Meetings section.

## Technical Stack
*   **Frontend:** Next.js (Single Page Application)
*   **Backend:** Python with FastAPI
*   **Database:** SQLite

## Database Schema Design
*   `User`: Represents the default authenticated host.
*   `Meeting`: Stores `meeting_id`, `title`, `description`, `scheduled_start_time`, `duration`, and `is_instant`. 
*   `Participant`: Tracks joined users and their display names linked to specific meetings.

## Assumptions & Disclaimers
*   **Authentication:** Assume a default user is actively logged in; focus remains heavily on core functionality rather than robust authentication flows.
*   **Data Seeding:** The database is seeded with initial sample data to populate the upcoming and recent meetings lists upon initialization.
*   **AI Utilization:** AI assistants were utilized for scaffolding and boilerplate generation, with all implementation decisions thoroughly understood.

## Setup & Startup Instructions

The project features automated smart scripts for both Windows and Mac/Linux. These scripts automatically handle virtual environment creation, module installation, and concurrent startup. Setup tasks (like `npm install` and `pip install`) only trigger on the first run or if changes to the dependency files are detected.

**1. Clone the repository:**
```bash
git clone [https://github.com/Awesome06/zoom-clone-fullstack.git](https://github.com/Awesome06/zoom-clone-fullstack.git)
cd zoom-clone-fullstack
```

**2.1 Run the Application (Mac/Linux):**
Make the shell script executable and run it. The script will install dependencies if needed, boot the backend in the background, and start the frontend in the foreground.
```bash
chmod +x start.sh
./start.sh
```

**2.2 Run the Application (Windows):**
Simply execute the batch file from your command prompt or double-click it. It will check for dependency updates, launch the FastAPI backend in a new command window, and start the Next.js frontend in the current window.
```cmd
start.bat
```

## Deployment
*   **Frontend Live Link:** [URL here (To be Added)]
*   **Backend API Link:** [URL here (To be Added)]
