# PrintLite - Document Printing Service

A full-stack web application for document printing services with hybrid backend architecture.

## Architecture

### Development Environment (Replit)
- **Backend**: Node.js Express server with in-memory storage
- **Frontend**: React + Vite development server
- **Port**: 5000 (both frontend and backend)

### Production Environment (AWS Amplify Gen 2)
- **Authentication**: AWS Cognito User Pools
- **API**: GraphQL with AppSync
- **Storage**: S3 for file uploads
- **Database**: DynamoDB
- **Hosting**: Amplify Hosting

## Getting Started

### Development (Replit)
```bash
npm run dev
```

### Production Deployment (AWS Amplify)
1. Ensure AWS CLI is configured
2. Install Amplify CLI Gen 2:
   ```bash
   npm install -g @aws-amplify/backend-cli
   ```
3. Initialize and deploy:
   ```bash
   npx ampx sandbox
   ```

## Environment Variables

For production deployment, set these in your Amplify environment:

- `VITE_USER_POOL_ID` - Cognito User Pool ID
- `VITE_USER_POOL_CLIENT_ID` - Cognito App Client ID  
- `VITE_IDENTITY_POOL_ID` - Cognito Identity Pool ID
- `VITE_GRAPHQL_ENDPOINT` - GraphQL API endpoint
- `VITE_API_KEY` - GraphQL API key
- `VITE_S3_BUCKET` - S3 bucket name
- `VITE_AWS_REGION` - AWS region (default: us-east-1)

## Features

- File upload and management
- Print configuration (paper type, color, binding)
- Order management and tracking
- Admin panel for order processing
- User authentication and authorization
- Real-time order status updates

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Node.js, Express.js, Drizzle ORM
- **Cloud**: AWS Amplify Gen 2, Cognito, GraphQL, S3, DynamoDB
- **Build**: Vite, ESBuild
- **Deployment**: Replit (dev), AWS Amplify (prod)