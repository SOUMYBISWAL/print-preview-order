# AWS Amplify Backend Deployment Guide

## Current Status
Your PrintLite application is running successfully, but the AWS S3 bucket for file storage needs to be created. The app is configured to use AWS Amplify Storage but the backend isn't deployed yet.

## Issue Identified
The AWS credentials provided appear to be temporary session credentials or may be expired. AWS keys starting with "ASIA" typically require a session token as well.

## Solution Options

### Option 1: Deploy Using AWS CLI (Recommended)
1. Make sure you have valid AWS credentials with these permissions:
   - S3 bucket creation and management
   - IAM role creation
   - CloudFormation stack creation

2. Run the deployment script:
   ```bash
   ./deploy-amplify.sh
   ```

### Option 2: Manual AWS CLI Commands
If the automated script fails, you can create the S3 bucket manually:

```bash
# Create the S3 bucket
aws s3 mb s3://printlite-storage-bucket --region ap-south-1

# Set CORS policy for web uploads
aws s3api put-bucket-cors --bucket printlite-storage-bucket --cors-configuration file://cors-config.json

# Set public read policy if needed
aws s3api put-bucket-policy --bucket printlite-storage-bucket --policy file://bucket-policy.json
```

### Option 3: AWS Console Manual Setup
1. Go to AWS S3 Console
2. Create bucket named: `printlite-storage-bucket`
3. Region: `ap-south-1` (or your preferred region)
4. Configure CORS settings for web uploads
5. Set appropriate bucket policies

## After Deployment
Once the S3 bucket is created, the app will automatically work with file uploads. The configuration in `client/src/lib/amplify-config.ts` will connect to your S3 bucket.

## Verification
After deployment, test file upload functionality:
1. Go to the Upload page
2. Try uploading a PDF or image file
3. Check AWS S3 console to verify files are stored

## Troubleshooting
- If uploads fail, check AWS credentials
- Verify S3 bucket permissions and CORS settings
- Check browser console for detailed error messages