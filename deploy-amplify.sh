#!/bin/bash

echo "🚀 Deploying Amplify Gen2 Backend"
echo "================================="

# Check if AWS credentials are configured
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install AWS CLI first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version 20+ required. Current version: $(node --version)"
    echo "💡 Consider using: nvm use 20"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "📦 Installing dependencies..."

# Install dependencies
npm ci --cache .npm --prefer-offline

echo "🔧 Building Amplify backend..."

# Deploy the backend
npx ampx sandbox --outputs-format=json --outputs-out-dir=. --once

if [ $? -eq 0 ]; then
    echo "✅ Amplify backend deployed successfully!"
    echo "📁 amplify_outputs.json has been generated"
    echo ""
    echo "🎉 Your React app is now connected to AWS Amplify Gen2!"
    echo "🔄 The app will automatically detect and use the backend configuration."
else
    echo "❌ Deployment failed. Please check your AWS credentials and try again."
    echo "💡 Run: npx ampx configure profile"
fi