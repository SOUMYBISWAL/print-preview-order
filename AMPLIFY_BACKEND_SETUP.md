# Amplify Backend Setup Guide

## Current Status
❌ AWS credentials provided are invalid/expired
- Error: "The AWS Access Key Id you provided does not exist in our records"
- Error: "The security token included in the request is invalid"

## Solutions to Deploy Your Amplify Backend

### Option 1: Update AWS Credentials (Recommended)
1. **Go to AWS Console**: https://console.aws.amazon.com/
2. **Navigate to IAM**: Services → IAM → Users → Your User
3. **Create New Access Key**:
   - Go to "Security credentials" tab
   - Click "Create access key"
   - Choose "Application running on AWS CLI"
   - Download the credentials
4. **Update Replit Secrets** with new credentials:
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY
   - AWS_REGION (e.g., ap-southeast-1)

### Option 2: Use AWS CloudShell
1. Open AWS CloudShell in your AWS Console
2. Clone your repository
3. Run: `npx ampx sandbox` from the project root

### Option 3: Local Development with AWS CLI
1. Install AWS CLI locally
2. Run: `aws configure` with your credentials
3. Deploy from your local machine: `npx ampx sandbox`

### Option 4: Use GitHub Actions (CI/CD)
1. Set up GitHub Actions with AWS credentials
2. Configure automated deployment pipeline
3. Deploy via GitHub workflow

## What Your Backend Will Create
When successfully deployed, your Amplify backend will create:

✅ **S3 Storage Bucket** for file uploads
✅ **Cognito Identity Pool** for authentication  
✅ **IAM Roles** for proper access control
✅ **CDK Stack** with all infrastructure

## Current Configuration Ready
Your backend configuration is already set up in `/amplify/`:
- `backend.ts` - Main backend definition
- `auth/resource.ts` - Authentication settings
- `storage/resource.ts` - S3 storage configuration
- `data/resource.ts` - Data layer setup

## Next Steps
1. Get valid AWS credentials
2. Update Replit secrets
3. Run deployment command
4. Your admin panel will then show real files from S3 storage

The application works perfectly with local storage currently - this just adds cloud persistence.