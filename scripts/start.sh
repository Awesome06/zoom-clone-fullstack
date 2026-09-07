#!/bin/bash

# Backend Setup & Startup
cd backend || exit
touch .requirements.cached
if [ ! -d "venv" ] || ! cmp -s requirements.txt .requirements.cached; then
    echo "Changes detected or missing venv. Setting up Backend..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cp requirements.txt .requirements.cached
else
    echo "Backend dependencies up to date."
    source venv/bin/activate
fi

echo "Starting FastAPI Backend..."
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Frontend Setup & Startup
cd ../frontend || exit
touch .package.cached
if [ ! -d "node_modules" ] || ! cmp -s package.json .package.cached; then
    echo "Changes detected or missing node_modules. Setting up Frontend..."
    npm install
    cp package.json .package.cached
else
    echo "Frontend dependencies up to date."
fi

# Trap to ensure background backend process closes when frontend stops
trap "kill $BACKEND_PID" EXIT

echo "Starting Next.js Frontend..."
npm run dev