# AWS Amplify Backend Setup Guide

## Overview

This document provides step-by-step instructions to deploy the PrintLite application backend using AWS Amplify Gen 2, eliminating the "AWS credentials not found" errors and enabling full S3 file upload functionality.

## Architecture

The AWS Amplify backend includes:
- **Authentication (Cognito)**: User management with email-based login
- **Data (DynamoDB + AppSync)**: GraphQL API for order and user management
- **Storage (S3)**: Secure file upload and storage
- **Functions (Lambda)**: Price calculation and order processing

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI installed and configured
3. Node.js 18+ installed
4. Amplify CLI v12+ installed: `npm install -g @aws-amplify/cli`

## Step 1: Initialize Amplify Project

```bash
# In your project root directory
npx ampx configure profile
# Follow prompts to configure AWS credentials

# Initialize the Amplify backend
npx ampx sandbox
```

## Step 2: Configure Environment Variables

Create a `.env` file in your project root:

```bash
# AWS Configuration (automatically populated after deployment)
AWS_REGION=us-east-1
AWS_USER_POOL_ID=your-user-pool-id
AWS_USER_POOL_CLIENT_ID=your-client-id
AWS_IDENTITY_POOL_ID=your-identity-pool-id
AWS_APPSYNC_GRAPHQL_ENDPOINT=your-appsync-endpoint
AWS_APPSYNC_REGION=us-east-1
AWS_APPSYNC_AUTHENTICATION_TYPE=AWS_IAM
AWS_S3_BUCKET=your-s3-bucket-name

# Application Configuration
NODE_ENV=production
DATABASE_URL=your-postgres-url (if using hybrid approach)
```

## Step 3: Deploy Backend Resources

The Amplify backend is configured with the following resources:

### Authentication (amplify/auth/resource.ts)
- Email-based authentication
- Admin and User groups
- Password policies

### Data (amplify/data/resource.ts)
- Order model with comprehensive fields
- User model
- Guest and authenticated access patterns

### Storage (amplify/storage/resource.ts)
- S3 bucket for file uploads
- Access patterns for documents and uploads
- CORS configuration

Deploy the backend:

```bash
# Deploy to sandbox environment
npx ampx sandbox

# Deploy to production
npx ampx deploy --branch main
```

## Step 4: Update Frontend Configuration

After deployment, update your frontend configuration:

### client/src/lib/amplify.ts

The configuration will automatically detect `amplify_outputs.json` generated during deployment.

### Environment Detection

The application automatically detects AWS credentials availability:

```typescript
// In client/src/lib/amplify.ts
export { hasAWSCredentials };

// Usage in components
if (hasAWSCredentials) {
  // Use AmplifyFileUploader
} else {
  // Use LocalFileUploader
}
```

## Step 5: Configure File Upload Components

### S3 Upload (when AWS is available)

```typescript
// client/src/components/AmplifyFileUploader.tsx
import { FileUploader } from '@aws-amplify/ui-react-storage';

// Automatically uses S3 when AWS credentials are available
```

### Local Upload (development fallback)

```typescript
// client/src/components/LocalFileUploader.tsx
// Provides local development experience
```

## Step 6: API Integration

### GraphQL Operations

The backend provides GraphQL operations for:

```typescript
// Order operations
const CREATE_ORDER = `
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      customerName
      email
      totalAmount
      status
      fileNames
      createdAt
    }
  }
`;

const LIST_ORDERS = `
  query ListOrders {
    listOrders {
      items {
        id
        customerName
        email
        totalAmount
        status
        createdAt
      }
    }
  }
`;
```

### REST API Integration

Enhanced REST API endpoints in `server/api-routes.ts`:

- `POST /api/calculate-price` - Calculate printing costs
- `POST /api/orders` - Create new orders  
- `GET /api/orders/:userId` - Get user orders
- `GET /api/admin/orders` - Admin order management
- `PUT /api/admin/orders/:orderId` - Update order status

## Step 7: Deployment Configuration

### amplify.yml

```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - cd amplify && npm ci
        - cd amplify && npm run build
        - npx ampx generate outputs --app-id $AWS_APP_ID --branch $AWS_BRANCH --format json --out-dir .
frontend:
  phases:
    preBuild:
      commands:
        - npm install --force
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist/public
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - amplify/node_modules/**/*
```

## Step 8: Environment-Specific Features

### Production Features (AWS)
- S3 file uploads with secure URLs
- DynamoDB data persistence
- Cognito user authentication
- AppSync GraphQL API
- Lambda function processing

### Development Features (Local)
- Local file simulation
- PostgreSQL database
- In-memory session storage
- Express.js REST API

## Step 9: Monitoring and Debugging

### Check AWS Resources

```bash
# View deployed resources
npx ampx status

# Check logs
npx ampx logs

# Delete sandbox (if needed)
npx ampx sandbox delete
```

### Frontend Debugging

```javascript
// Check AWS configuration
console.log('AWS Config:', import.meta.env);
console.log('Has AWS Credentials:', hasAWSCredentials);

// Check Amplify status
import { Amplify } from 'aws-amplify';
console.log('Amplify Config:', Amplify.configure());
```

## Step 10: Production Checklist

- [ ] AWS credentials configured
- [ ] Backend deployed via `npx ampx deploy`
- [ ] `amplify_outputs.json` generated
- [ ] Environment variables set
- [ ] File upload testing completed
- [ ] Admin panel functionality verified
- [ ] Order management working
- [ ] S3 bucket accessible
- [ ] GraphQL API responding
- [ ] Authentication flow working

## Troubleshooting

### Common Issues

1. **"AWS credentials not found"**
   - Ensure `amplify_outputs.json` exists
   - Check AWS CLI configuration
   - Verify deployment completed successfully

2. **File upload failures**
   - Check S3 bucket permissions
   - Verify CORS configuration
   - Test with smaller files first

3. **GraphQL errors**
   - Check AppSync endpoint URL
   - Verify API key or authentication
   - Test queries in AWS Console

4. **Database connection issues**
   - Ensure DynamoDB tables created
   - Check IAM permissions
   - Verify region configuration

### Support Resources

- [AWS Amplify Gen 2 Documentation](https://docs.amplify.aws/gen2/)
- [Amplify Storage Documentation](https://docs.amplify.aws/gen2/build-a-backend/storage/)
- [Amplify Data Documentation](https://docs.amplify.aws/gen2/build-a-backend/data/)
- [Amplify Auth Documentation](https://docs.amplify.aws/gen2/build-a-backend/auth/)

## Cost Optimization

- Use S3 Intelligent Tiering for file storage
- Implement DynamoDB On-Demand billing
- Configure CloudWatch log retention
- Set up AWS Budget alerts

This setup provides a robust, scalable backend infrastructure for the PrintLite application with proper AWS integration.