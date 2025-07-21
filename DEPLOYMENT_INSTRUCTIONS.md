# AWS Amplify Gen 2 Deployment Instructions

## Prerequisites

1. **Delete Gen 1 Backend Environments** (Important!)
   - Go to AWS Amplify Console → Your App → Manage backends
   - Delete ALL existing backend environments
   - Wait 5-10 minutes for complete deletion

2. **GitHub Repository**
   - Ensure your code is pushed to GitHub
   - Make sure the main/master branch has all latest changes

## Deployment Steps

### Step 1: Create New Amplify App

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Choose "GitHub" as source
4. Select your repository and branch

### Step 2: Build Settings

Amplify should auto-detect the `amplify.yml` file. If not, use these settings:

**Build Command**: `npm run build`
**Build Output Directory**: `dist/public`

The amplify.yml handles:
- Installing dependencies
- Gen 2 backend deployment
- Frontend build process

### Step 3: Environment Variables (Optional)

For production database:
- `DATABASE_URL`: Your PostgreSQL connection string

### Step 4: Deploy

1. Click "Save and Deploy"
2. Monitor the build process:
   - **Provision**: Sets up build environment
   - **Build**: Runs backend and frontend builds
   - **Deploy**: Deploys to CDN
   - **Verify**: Health checks

## Expected Build Process

### Backend Phase
```bash
npm ci --cache .npm --prefer-offline
npx ampx generate outputs --app-id $AWS_APP_ID --branch $AWS_BRANCH
```

### Frontend Phase
```bash
npm ci --cache .npm --prefer-offline
npm run build
```

## What Gets Created

1. **Authentication**: Cognito User Pool for user management
2. **Data**: AppSync GraphQL API with DynamoDB
3. **Storage**: S3 bucket for file uploads
4. **Frontend**: Static hosting with CDN

## Verification

After deployment:

1. **File Uploads**: Test document upload functionality
2. **Order Creation**: Create a test print order
3. **Admin Panel**: Check order appears in admin dashboard
4. **Order Tracking**: Verify order tracking works

## Troubleshooting

### Build Failures
- Check build logs in Amplify Console
- Verify all dependencies are in package.json
- Ensure Node.js version compatibility

### Backend Issues
- Confirm Gen 1 environments were deleted
- Check IAM permissions for backend resources
- Verify region consistency

### File Upload Issues
- Check S3 bucket permissions
- Verify CORS configuration
- Test with smaller files first

## Features Working After Deployment

✅ **File Upload**: Direct S3 upload with progress tracking
✅ **Order Management**: Real-time order creation and updates  
✅ **Admin Panel**: Live order dashboard with status updates
✅ **Order Tracking**: Customer order lookup functionality
✅ **Responsive Design**: Works on all devices
✅ **Type Safety**: Full TypeScript support

## Domain Configuration (Optional)

To use a custom domain:
1. Go to App Settings → Domain Management
2. Add your domain
3. Follow DNS configuration steps
4. Certificate will be auto-provisioned

## Monitoring

Use AWS CloudWatch to monitor:
- API requests and errors
- File upload success rates
- Database query performance
- Frontend loading times

The deployment provides a production-ready PrintLite application with full AWS backend integration!