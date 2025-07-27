# PrintLite Deployment Guide

## Overview
PrintLite supports multiple deployment strategies to fit different needs and infrastructure requirements.

## Deployment Options

### 1. Development (Replit) ✅ Currently Active
- **Status**: Fully functional and tested
- **Backend**: Node.js Express server with in-memory storage
- **Frontend**: React development server with HMR
- **Access**: Local development on port 5000
- **Features**: All features working including file upload, order management, admin panel

**To run locally:**
```bash
npm run dev
```

### 2. AWS Amplify Hosting (Frontend-Only) ✅ Ready for Deployment
- **Status**: Configured and ready
- **Backend**: Uses existing APIs or can be configured with external backend
- **Frontend**: Static React build optimized for production
- **Features**: Responsive UI, file handling, order management (with backend API)

**Deployment process:**
1. Connect GitHub repository to AWS Amplify
2. Configure build settings using provided `amplify.yml`
3. Set environment variables in Amplify Console
4. Deploy automatically on push to main branch

**Required Environment Variables:**
- `VITE_API_URL` - Your backend API URL
- Optional: AWS Cognito/GraphQL variables if using full AWS stack

### 3. AWS Amplify Gen 2 (Full Stack) 🚧 Configured
- **Status**: Backend configuration ready, requires AWS setup
- **Backend**: AWS Cognito, GraphQL API, S3 Storage, DynamoDB
- **Frontend**: React app with AWS SDK integration
- **Features**: Full cloud infrastructure with authentication, database, file storage

**Setup process:**
1. Install AWS Amplify CLI Gen 2: `npm install -g @aws-amplify/backend-cli`
2. Configure AWS credentials
3. Deploy backend: `npx ampx sandbox` (dev) or `npx ampx deploy` (prod)
4. Configure frontend environment variables
5. Deploy frontend via Amplify Hosting

## Current Recommendation

**For immediate deployment**: Use AWS Amplify Hosting (Option 2)
- Fastest to deploy
- No backend configuration required
- Can connect to existing Replit backend or any external API
- Full frontend functionality preserved

## Build Configuration

The project includes optimized build configurations:

- **Development**: `npm run dev` - Full-stack local development
- **Production**: `npm run build` - Frontend + backend bundle
- **Frontend-only**: Builds static React app for hosting

## File Structure for Deployment

```
dist/
├── public/           # Static frontend assets
│   ├── index.html   # Main HTML file
│   └── assets/      # CSS, JS, images
└── index.js         # Backend bundle (if needed)
```

## Deployment Status Summary

✅ **Replit Development**: Fully functional
✅ **AWS Amplify Frontend**: Ready for deployment  
🚧 **AWS Amplify Full Stack**: Backend configured, AWS setup required

The application is production-ready and can be deployed immediately using AWS Amplify's frontend hosting with the provided configuration.