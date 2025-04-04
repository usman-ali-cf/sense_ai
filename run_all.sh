#!/bin/bash

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3 and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Create backend directories if they don't exist
mkdir -p backend/uploads
mkdir -p backend/urls
mkdir -p backend/vectorstores

# Check if virtual environment exists, create if not
if [ ! -d "backend/venv" ]; then
    echo "Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    cd ..
fi

# Activate virtual environment and install dependencies
echo "Installing backend dependencies..."
cd backend
source venv/bin/activate || source venv/Scripts/activate
pip install -r requirements.txt

# Start the FastAPI server in the background
echo "Starting FastAPI server..."
python run_server.py &
BACKEND_PID=$!
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Start the Next.js development server
echo "Starting Next.js development server..."
npm run dev

# When the Next.js server is terminated, also terminate the FastAPI server
kill $BACKEND_PID

