@echo off
setlocal

REM Check if Python is installed
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Python is not installed. Please install Python and try again.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js and try again.
    exit /b 1
)

REM Create backend directories if they don't exist
if not exist backend\uploads mkdir backend\uploads
if not exist backend\urls mkdir backend\urls
if not exist backend\vectorstores mkdir backend\vectorstores

REM Check if virtual environment exists, create if not
if not exist backend\venv (
    echo Creating Python virtual environment...
    cd backend
    python -m venv venv
    cd ..
)

REM Activate virtual environment and install dependencies
echo Installing backend dependencies...
cd backend
call venv\Scripts\activate
pip install -r requirements.txt

REM Start the FastAPI server in a new window
echo Starting FastAPI server...
start cmd /k "venv\Scripts\activate && python run_server.py"
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
call npm install

REM Start the Next.js development server
echo Starting Next.js development server...
call npm run dev

