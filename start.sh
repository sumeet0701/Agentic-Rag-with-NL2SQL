#!/bin/bash

set -e  # Exit immediately if any command fails

echo "🚀 Starting Frontend Initialization..."

# Go to frontend folder
cd Frontend

# Install frontend dependencies
npm install

# Build frontend
npm run build

# Start frontend on port 8080
npm run dev &

echo "✅ Frontend started successfully!"

# Go back to root directory
cd ..

echo "🚀 Starting Backend Initialization..."

# Go to backend folder
cd backend

# Activate virtual environment
source .venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Start backend API
python main.py

echo "✅ Backend started successfully!"
