# AWS Amplify Storage Setup for PrintLite

## Overview
This guide will help you set up AWS Amplify Storage with automatic S3 bucket creation for the PrintLite application.

## Prerequisites
- AWS Account
- AWS CLI installed (optional but recommended)
- Node.js 18+ installed

## Step 1: Deploy the Amplify Backend

1. Navigate to the amplify directory:
   ```bash
   cd amplify
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Deploy the backend (this will create the S3 bucket automatically):
   ```bash
   npx ampx deploy
   ```

   During deployment, Amplify will:
   - Create an S3 bucket with a unique name
   - Set up IAM roles and policies
   - Configure CORS for web access
   - Generate the configuration file

## Step 2: Update Frontend Configuration

After deployment, you'll get an `amplify_outputs.json` file. Copy it to your client directory:

```bash
cp amplify_outputs.json ../client/src/
```

## Step 3: Update the Amplify Configuration

Replace the placeholder configuration in `client/src/lib/amplify-config.ts` with:

```typescript
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

export { outputs as amplifyConfig };
```

## Step 4: Environment Variables (Alternative Setup)

If you prefer to use environment variables instead of the outputs file:

1. Create a `.env` file in the client directory:
   ```
   VITE_AWS_REGION=us-east-1
   VITE_S3_BUCKET=your-bucket-name
   ```

2. Update `amplify-config.ts`:
   ```typescript
   import { Amplify } from 'aws-amplify';

   const amplifyConfig = {
     Storage: {
       S3: {
         bucket: import.meta.env.VITE_S3_BUCKET,
         region: import.meta.env.VITE_AWS_REGION,
       }
     }
   };

   Amplify.configure(amplifyConfig);
   ```

## Step 5: Verify Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the upload page
3. Try uploading a file - it should now be stored in your S3 bucket

## Troubleshooting

### Authentication Issues
If you see authentication errors:
1. Check your AWS credentials are properly configured
2. Ensure the IAM roles have the correct permissions
3. Verify CORS settings in your S3 bucket

### File Upload Failures
If files aren't uploading:
1. Check the browser console for errors
2. Verify the S3 bucket permissions
3. Ensure the bucket name is correct in your configuration

## Production Deployment

For production deployment to AWS Amplify:
1. Push your code to a Git repository
2. Connect the repository to AWS Amplify Console
3. Set the build settings to use the updated `amplify.yml`
4. Deploy the application

The S3 bucket will be automatically provisioned and connected to your application.

## Security Notes

- Files are uploaded with guest access for demo purposes
- In production, consider implementing user authentication
- Review and adjust S3 bucket policies as needed
- Consider enabling S3 versioning and backup policies