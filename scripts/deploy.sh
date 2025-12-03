#!/bin/bash

# Ganhos Bybit - Vercel Deployment Script
# This script helps deploy the application to Vercel

set -e

echo "🚀 Ganhos Bybit - Vercel Deployment"
echo "===================================="
echo ""

# Use npx to run Vercel CLI without global installation
echo "🔐 Checking Vercel authentication..."
if ! npx vercel@latest whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel."
    echo "Please run: npx vercel@latest login"
    exit 1
fi
echo "✅ Authenticated with Vercel"
echo ""

# Check environment variables
echo "🔍 Checking environment variables..."
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found."
    echo "Creating .env from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "📝 Please edit .env with your Supabase credentials before deploying."
        echo "Press Enter to continue after editing .env..."
        read
    else
        echo "❌ .env.example not found. Please create .env manually."
        exit 1
    fi
fi
echo "✅ Environment file found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Run build
echo "🔨 Building the project..."
npm run build
echo "✅ Build completed successfully"
echo ""

# Ask for deployment type
echo "Select deployment type:"
echo "1) Preview deployment"
echo "2) Production deployment"
read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "🌐 Deploying to Preview..."
        npx vercel@latest
        ;;
    2)
        echo ""
        echo "🚀 Deploying to Production..."
        npx vercel@latest --prod
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment completed successfully!"
echo "🎉 Your application is now live on Vercel!"
