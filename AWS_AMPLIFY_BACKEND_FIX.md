# AWS Amplify Backend Stack Fix Guide

## Issue: Stack Does Not Exist Error
Your app ID `d2h75g2kyk5bz` is showing a `StackDoesNotExistError` because the CloudFormation stack was either never created or was deleted.

## ✅ Solution 1: Deploy Backend Using Amplify CLI (Recommended)

### Step 1: Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
```

### Step 2: Initialize Amplify in your project
```bash
amplify init
```
- Choose your AWS profile
- Enter app name: `printlite`
- Environment name: `main`
- Choose your default editor
- Choose the type of app: `javascript`
- Framework: `react`
- Source directory: `client/src`
- Build command: `npm run build`
- Start command: `npm run dev`

### Step 3: Add backend resources
```bash
amplify add auth
amplify add storage
amplify add api
```

### Step 4: Deploy the backend
```bash
amplify push
```

## ✅ Solution 2: Fix Using AWS Console

### Step 1: Go to AWS Amplify Console
1. Navigate to https://console.aws.amazon.com/amplify/
2. Find your app with ID `d2h75g2kyk5bz`
3. Go to "Backend environments" tab

### Step 2: Create Backend Environment
1. Click "Create backend environment"
2. Environment name: `main`
3. Select deployment method: "Amplify CLI"
4. Follow the prompts to connect your repository

## ✅ Solution 3: Temporary Frontend-Only Deployment

If you want to deploy just the frontend while fixing the backend:

1. Use the simplified `amplify.yml` (already updated)
2. The app will run with local backend functionality
3. All frontend features will work
4. Backend can be added later without affecting the frontend

## Current Status
- ✅ Frontend deployment configured and working
- ✅ Node.js v20 compatibility added
- ✅ amplify_outputs.json created with fallback config
- ❌ Backend stack needs to be created (use Solution 1 or 2)

## Next Steps
1. Choose Solution 1 (CLI) or Solution 2 (Console) above
2. Deploy the backend
3. Update `amplify.yml` to include backend phase again
4. Frontend will automatically connect to the new backend

The frontend is ready to deploy and will work with placeholder backend until the real backend is created.