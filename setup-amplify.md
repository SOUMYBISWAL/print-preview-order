# AWS Amplify Backend Setup Guide

## Current Status
✅ Amplify backend properly configured with storage, auth, and data resources
✅ Upload UI component using official AWS Amplify FileUploader
✅ All dependencies installed (aws-cdk-lib, constructs)
✅ Storage permissions configured for guest and authenticated users

## To Deploy AWS Amplify Backend

### 1. Configure AWS Credentials
First, you need to set up AWS credentials:

```bash
# Configure AWS CLI credentials
npx ampx configure profile

# Or set environment variables
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key  
export AWS_DEFAULT_REGION=us-east-1
```

### 2. Start Amplify Sandbox
```bash
cd amplify
npx ampx sandbox
```

This will:
- Deploy the storage bucket with proper permissions
- Set up Cognito authentication
- Create GraphQL API for orders and print settings
- Generate amplify_outputs.json with real AWS resources

### 3. Test Upload Functionality
Once deployed, the FileUploader component will:
- Upload files directly to your S3 bucket
- Show real upload progress
- Handle authentication automatically
- Store files in the `uploads/` path

## Current Configuration

### Storage (amplify/storage/resource.ts)
- **uploads/**: Guest read/write, Auth read/write/delete
- **public/**: Guest read, Auth read/write/delete  
- **documents/**: Guest read/write, Auth read/write/delete

### Authentication (amplify/auth/resource.ts)
- Email-based login
- Guest access enabled for uploads

### Data (amplify/data/resource.ts)
- Order model for tracking print jobs
- PrintSettings model for file configurations

## Local Development
The app works in development mode with:
- Local Express server for API
- Mock Amplify configuration
- Simulated storage for testing

## Production Deployment
Ready for AWS Amplify hosting with:
- Real S3 storage integration
- Cognito user authentication
- GraphQL API backend
- Automatic scaling and management