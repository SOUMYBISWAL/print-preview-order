#!/bin/bash

echo "🚀 Deploying AWS Amplify Backend for PrintLite"
echo "================================================"

# Check AWS credentials
echo "Checking AWS credentials..."
aws sts get-caller-identity

if [ $? -ne 0 ]; then
    echo "❌ AWS credentials invalid. Please update your credentials first:"
    echo "1. AWS Console → IAM → Users → Security Credentials"
    echo "2. Create new access key (starts with 'AKIA')"
    echo "3. Update Replit Secrets with new credentials"
    exit 1
fi

echo "✅ AWS credentials valid"

# Deploy Amplify backend
echo "Deploying Amplify backend..."
npx ampx sandbox --once

if [ $? -eq 0 ]; then
    echo "✅ Amplify backend deployed successfully!"
    echo "✅ S3 bucket created automatically"
    echo "✅ amplify_outputs.json generated"
    
    # Switch back to AWS storage in the app
    echo "Switching app to use AWS S3 storage..."
    sed -i 's/LocalFileUploader/AmplifyFileUploader/g' client/src/pages/Upload.tsx
    sed -i 's/LocalFileUploader/AmplifyFileUploader/g' client/src/pages/Upload.tsx
    
    echo "🎉 Complete! Your app now uses AWS S3 storage."
    echo "File uploads will be stored in the cloud."
else
    echo "❌ Amplify deployment failed"
    echo "App continues to work with local storage"
fi