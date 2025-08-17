# Amplify Backend Setup Guide

## Issue: "No Backend Environment" Error

The application is showing "no backend environment" because the AWS Amplify backend needs to be deployed to create the DynamoDB tables and S3 storage buckets.

## Current Status
- ✅ Amplify backend configuration is complete (amplify/backend.ts)
- ✅ Frontend integration with Amplify is complete
- ❌ Backend resources not deployed to AWS yet

## Solution Steps

### Step 1: Deploy Amplify Backend
```bash
# Install Amplify CLI if not already installed
npm install -g @aws-amplify/cli@latest

# Deploy the backend
npx amplify sandbox --profile sandbox
```

### Step 2: Configure Environment Variables
After deployment, Amplify will provide:
- DynamoDB table names
- S3 bucket names  
- API endpoints
- Authentication configuration

### Step 3: Update Frontend Configuration
The deployed backend will automatically provide the configuration for:
- amplify_outputs.json (auto-generated)
- Environment variables for production

## Backend Resources Created
Once deployed, the following will be available:

### DynamoDB Tables
- **PrintOrders**: Stores print job orders with customer details
- **FileMetadata**: Tracks uploaded files with S3 keys and metadata
- **PrintSettings**: Stores print configuration preferences

### S3 Storage
- **File Storage Bucket**: Stores uploaded documents
- **Public/Private access controls**: Configured for secure file management

### Authentication
- **Cognito User Pool**: For admin authentication (if needed)
- **IAM Roles**: For secure resource access

## Troubleshooting

### If deployment fails:
1. Check AWS credentials are configured
2. Ensure sufficient IAM permissions
3. Check region availability for all services

### If "no backend environment" persists:
1. Verify amplify_outputs.json exists
2. Check Amplify configuration in main.tsx
3. Restart the development server

## Development vs Production
- **Development**: Uses amplify sandbox for testing
- **Production**: Requires full Amplify app deployment

The app currently falls back to localStorage when backend is not available, ensuring functionality during development.