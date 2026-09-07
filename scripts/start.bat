@echo off
SETLOCAL EnableDelayedExpansion

echo Checking Backend Setup...
cd backend
IF NOT EXIST .requirements.cached type nul > .requirements.cached
fc requirements.txt .requirements.cached >nul
IF %ERRORLEVEL% NEQ 0 (
    echo Changes detected. Installing backend dependencies...
    IF NOT EXIST venv python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
    copy /Y requirements.txt .requirements.cached >nul
) ELSE (
    IF NOT EXIST venv (
        echo Missing venv. Installing backend dependencies...
        python -m venv venv
        call venv\Scripts\activate.bat
        pip install -r requirements.txt
        copy /Y requirements.txt .requirements.cached >nul
    ) ELSE (
        echo Backend dependencies up to date.
        call venv\Scripts\activate.bat
    )
)

echo Starting FastAPI Backend...
start "FastAPI Backend" cmd /k "uvicorn main:app --reload --port 8000"

echo Checking Frontend Setup...
cd ..\frontend
IF NOT EXIST .package.cached type nul > .package.cached
fc package.json .package.cached >nul
IF %ERRORLEVEL% NEQ 0 (
    echo Changes detected. Installing frontend dependencies...
    call npm install
    copy /Y package.json .package.cached >nul
) ELSE (
    IF NOT EXIST node_modules (
        echo Missing node_modules. Installing frontend dependencies...
        call npm install
        copy /Y package.json .package.cached >nul
    ) ELSE (
        echo Frontend dependencies up to date.
    )
)

echo Starting Next.js Frontend...
call npm run dev