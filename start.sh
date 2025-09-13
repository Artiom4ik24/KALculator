#!/bin/bash

# Exit immediately if a command fails
set -e

# Start Django backend
echo "Starting Django backend..."
cd backend/KALculator
# Run migrations just in case
python manage.py migrate
# Run backend in background
python manage.py runserver &
BACKEND_PID=$!
cd ..
cd ..

# Start React frontend
echo "Starting React frontend..."
cd frontend
npm run preview &
FRONTEND_PID=$!
cd ..

# Trap Ctrl+C and stop both
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID" INT

# Keep script running
wait
