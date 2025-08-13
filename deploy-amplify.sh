#!/bin/bash

# PrintLite AWS Amplify Deployment Script
echo "🚀 Setting up AWS Amplify Storage for PrintLite..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "⚠️  AWS CLI not found. Installing is recommended but not required."
    echo "   You can continue with the Amplify CLI."
fi

# Navigate to amplify directory
cd amplify

# Install dependencies
echo "📦 Installing Amplify dependencies..."
npm install

# Check if Amplify CLI is available
if ! command -v npx ampx &> /dev/null; then
    echo "❌ Amplify CLI not found. Installing..."
    npm install -g @aws-amplify/backend-cli
fi

# Deploy the backend
echo "🔨 Deploying Amplify backend..."
echo "   This will create:"
echo "   - S3 bucket for file storage"
echo "   - IAM roles and policies"
echo "   - CloudFormation stack"

npx ampx deploy

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "✅ Amplify backend deployed successfully!"
    
    # Copy outputs to client directory
    if [ -f "amplify_outputs.json" ]; then
        cp amplify_outputs.json ../client/src/
        echo "✅ Configuration copied to client directory"
    fi
    
    echo ""
    echo "🎉 Setup complete! Your S3 bucket is ready."
    echo ""
    echo "Next steps:"
    echo "1. Update client/src/lib/amplify-config.ts with the generated configuration"
    echo "2. Start your development server: npm run dev"
    echo "3. Test file uploads on the /upload page"
    echo ""
    echo "📖 For detailed instructions, see AWS_SETUP.md"
    
else
    echo "❌ Deployment failed. Please check your AWS credentials and try again."
    echo "   Make sure you have:"
    echo "   - Valid AWS credentials configured"
    echo "   - Sufficient permissions to create S3 buckets and IAM roles"
    echo "   - AWS CLI or Amplify CLI properly installed"
fi