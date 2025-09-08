#!/bin/bash

# Shop1 Development Server Startup Script - Fixed Version
echo "🚀 Starting Shop1 Development Servers (Fixed)..."

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

# Kill any existing processes on our ports
echo -e "${YELLOW}Cleaning up any existing processes...${NC}"
pkill -f "manage.py runserver" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Wait a moment for cleanup
sleep 2

# Start Django backend server
echo -e "${GREEN}Starting Django backend server...${NC}"
cd "${PROJECT_ROOT}/backendshop/backend"
python3 manage.py runserver 127.0.0.1:8000 &
BACKEND_PID=$!
echo -e "${GREEN}Backend server started with PID: ${BACKEND_PID}${NC}"

# Wait for backend to start
echo -e "${YELLOW}Waiting for backend to start...${NC}"
sleep 5

# Test backend connectivity
echo -e "${YELLOW}Testing backend connectivity...${NC}"
BACKEND_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/graphql/ || echo "000")
if [ "$BACKEND_TEST" = "200" ] || [ "$BACKEND_TEST" = "405" ]; then
    echo -e "${GREEN}✅ Backend is responding${NC}"
else
    echo -e "${RED}❌ Backend not responding (HTTP $BACKEND_TEST)${NC}"
fi

# Start React frontend server
echo -e "${GREEN}Starting React frontend server...${NC}"
cd "${PROJECT_ROOT}/frontend"
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend server started with PID: ${FRONTEND_PID}${NC}"

# Wait for frontend to start
echo -e "${YELLOW}Waiting for frontend to start...${NC}"
sleep 8

echo -e "${YELLOW}🎉 Servers are running:${NC}"
echo -e "${BLUE}📊 Backend (Django + GraphQL): http://127.0.0.1:8000${NC}"
echo -e "${BLUE}📊 GraphQL Playground: http://127.0.0.1:8000/graphql/${NC}"
echo -e "${BLUE}🌐 Frontend (React + Vite): http://localhost:5173${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"

# Test GraphQL endpoint
echo -e "${YELLOW}Testing GraphQL endpoint...${NC}"
GRAPHQL_TEST=$(curl -s -X POST http://127.0.0.1:8000/graphql/ \
  -H "Content-Type: application/json" \
  -d '{"query": "{ products { id name } }"}' | grep -c "data" || echo "0")

if [ "$GRAPHQL_TEST" -gt "0" ]; then
    echo -e "${GREEN}✅ GraphQL endpoint is working${NC}"
else
    echo -e "${RED}❌ GraphQL endpoint not responding properly${NC}"
fi

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
