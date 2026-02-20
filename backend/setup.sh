#!/bin/bash

# CareOps Backend Quick Start Script

echo "🚀 CareOps Backend Setup"
echo "========================"
echo ""

# Check Python version
echo "📋 Checking Python version..."
python3 --version || { echo "❌ Python 3 not found!"; exit 1; }
echo ""

# Create virtual environment
echo "🐍 Creating virtual environment..."
python3 -m venv venv
echo "✅ Virtual environment created"
echo ""

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate || { echo "❌ Failed to activate venv"; exit 1; }
echo "✅ Virtual environment activated"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
echo "✅ Dependencies installed"
echo ""

# Create .env file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file with your Supabase credentials!"
    echo ""
    echo "To edit: nano .env"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your Supabase credentials"
echo "2. Run migrations in Supabase SQL Editor (database/migrations/001_initial_schema.sql)"
echo "3. Start the server: uvicorn app.main:app --reload"
echo ""
echo "📚 Documentation: http://localhost:8000/docs"
echo ""
