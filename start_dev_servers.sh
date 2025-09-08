#!/bin/bash

# Shop1 Development Server Startup Script
echo "Starting Shop1 Development Servers..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to handle cleanup on script exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down servers...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set up cleanup trap
trap cleanup SIGINT SIGTERM

# Navigate to project root
cd "$(dirname "$0")"
PROJECT_ROOT=$(pwd)

echo -e "${BLUE}Project root: ${PROJECT_ROOT}${NC}"

# Start Django backend server
echo -e "${GREEN}Starting Django backend server...${NC}"
cd "${PROJECT_ROOT}/backendshop/backend"
python3 manage.py runserver 127.0.0.1:8000 &
BACKEND_PID=$!
echo -e "${GREEN}Backend server started with PID: ${BACKEND_PID}${NC}"

# Wait a moment for backend to start
sleep 3

# Start React frontend server
echo -e "${GREEN}Starting React frontend server...${NC}"
cd "${PROJECT_ROOT}/frontend"
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend server started with PID: ${FRONTEND_PID}${NC}"

echo -e "${YELLOW}Servers are running:${NC}"
echo -e "${BLUE}📊 Backend (Django + GraphQL): http://127.0.0.1:8000${NC}"
echo -e "${BLUE}📊 GraphQL Playground: http://127.0.0.1:8000/graphql/${NC}"
echo -e "${BLUE}🌐 Frontend (React + Vite): http://localhost:5173${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
