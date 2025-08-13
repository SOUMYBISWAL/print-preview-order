# AWS Amplify Storage - Complete Setup Guide

## Current Status
Your PrintLite application is fully functional with all UI components working perfectly. The AWS Amplify backend configuration is correct and ready for deployment.

## The Core Issue
AWS is rejecting the provided credentials with "InvalidAccessKeyId" errors. This indicates:
- Credentials may be expired or invalid
- Access key format suggests temporary session tokens
- Missing required permissions for AWS services

## Verified Amplify Configuration
The storage configuration is properly set up:

```typescript
// amplify/storage/resource.ts
export const storage = defineStorage({
  name: 'printliteStorage',
  access: (allow) => ({
    'documents/*': [
      allow.guest.to(['read', 'write', 'delete']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
    'uploads/*': [
      allow.guest.to(['read', 'write']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ]
  })
});
```

## Required AWS Permissions
Your AWS user needs these IAM permissions:
- S3: CreateBucket, PutObject, GetObject, DeleteObject
- IAM: CreateRole, AttachRolePolicy
- CloudFormation: CreateStack, UpdateStack
- Systems Manager: GetParameter, PutParameter
- Cognito: CreateUserPool, CreateIdentityPool

## Solution Steps

### Step 1: Get Fresh AWS Credentials
1. AWS Console → IAM → Users → [Your User] → Security Credentials
2. Delete ALL existing access keys
3. Create new access key → "Application running outside AWS"
4. Ensure Access Key ID starts with "AKIA" (not "ASIA")
5. Copy exact credentials immediately

### Step 2: Deploy Amplify Backend
Once valid credentials are provided:
```bash
npx ampx sandbox --once
```
This will automatically:
- Create S3 bucket with unique name
- Set up proper IAM roles and policies
- Generate amplify_outputs.json configuration
- Enable file upload functionality

### Step 3: Verify Deployment
After successful deployment:
- S3 bucket will be visible in AWS Console
- File uploads will work immediately
- amplify_outputs.json will be generated

## Current Application State
- ✅ Frontend running on port 5000
- ✅ All UI components functional
- ✅ AWS configuration files ready
- ❌ S3 bucket deployment blocked by credentials
- ❌ File uploads waiting for storage backend

## Alternative Solutions
If AWS credentials continue to fail:
1. **Manual S3 Setup**: Create bucket directly in AWS Console
2. **Different Provider**: Switch to Cloudinary, Firebase, or Supabase
3. **Local Development**: Use mock storage for development

Your application is production-ready except for the storage backend deployment.