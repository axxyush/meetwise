#!/bin/bash

echo "🚀 Setting up MeetWise Application..."

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "🐍 Installing backend dependencies..."
cd meetwise-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Install database dependencies
echo "🗄️ Installing database dependencies..."
cd database
npm install
cd ..

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start the backend: cd meetwise-backend && source venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo "2. Start the frontend: npm start"
echo ""
echo "Make sure MongoDB is running and the RunPod server is accessible!" 