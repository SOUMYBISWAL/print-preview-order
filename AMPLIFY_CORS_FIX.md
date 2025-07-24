# AWS Amplify S3 CORS Configuration Fix

## Issue
AWS Amplify deployment failing due to attempting to use `addPropertyOverride` on an imported S3 bucket resource.

## Root Cause
In AWS Amplify Gen 2, the S3 bucket is automatically created and managed by Amplify. You cannot use `addPropertyOverride` on resources that are imported or automatically created by Amplify.

## Solution

### Option 1: Remove CORS Configuration from Backend (Recommended)
The current backend.ts file has been cleaned to remove the problematic CORS configuration. AWS Amplify automatically handles CORS for file uploads and downloads through the Storage API.

### Option 2: Manual CORS Configuration (If Needed)
If you still need custom CORS configuration, you would need to:

1. **After deployment**, go to AWS S3 Console
2. Find your Amplify-created bucket (usually named like `amplify-appname-branch-xxxxx-storage-xxxxx`)
3. Go to Permissions > CORS configuration
4. Add the following CORS rules:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "POST", "PUT", "DELETE", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposedHeaders": ["ETag"],
        "MaxAge": 3000
    }
]
```

### Option 3: Use Amplify Storage API (Current Implementation)
The application already uses Amplify's Storage API which handles CORS automatically. The file upload components use:

- `uploadData()` for uploads
- `getUrl()` for downloads
- `list()` for file listing

These APIs automatically handle CORS through Amplify's managed infrastructure.

## Current Status
- Backend configuration cleaned and ready for deployment
- CORS will be handled automatically by Amplify Storage API
- No manual bucket configuration needed

## Deployment Steps
1. Deploy to AWS Amplify (should now succeed)
2. Test file upload functionality
3. If CORS issues persist, use Option 2 for manual configuration

The deployment error should now be resolved.