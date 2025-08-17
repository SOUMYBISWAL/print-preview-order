#!/bin/bash

# PrintLite - Amplify Backend Deployment Script
# This script deploys the AWS Amplify backend and configures the environment

echo "🚀 Starting PrintLite Amplify Backend Deployment..."

# Check if Amplify CLI is installed
if ! command -v amplify &> /dev/null; then
    echo "📦 Installing Amplify CLI..."
    npm install -g @aws-amplify/cli@latest
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run:"
    echo "   aws configure"
    exit 1
fi

echo "✅ AWS credentials verified"

# Deploy backend in sandbox mode for development
echo "🏗️  Deploying Amplify backend in sandbox mode..."
npx amplify sandbox --profile sandbox --once

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "✅ Backend deployment successful!"
    echo "📋 Next steps:"
    echo "   1. The application will now connect to AWS DynamoDB and S3"
    echo "   2. Upload files will be stored in S3"
    echo "   3. Print orders will be saved in DynamoDB"
    echo "   4. Admin panel will show real data from AWS"
    echo ""
    echo "🌐 You can now deploy the frontend to Amplify hosting"
    echo "   Use: npx amplify deploy --prod"
else
    echo "❌ Backend deployment failed"
    echo "Please check:"
    echo "   - AWS credentials have proper permissions"
    echo "   - All required services are available in your region"
    echo "   - Network connectivity to AWS"
    exit 1
fi

echo "🎉 PrintLite backend setup complete!"