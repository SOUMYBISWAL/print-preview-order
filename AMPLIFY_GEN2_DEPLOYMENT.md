# AWS Amplify Gen 2 Deployment Guide for PrintLite

## Overview

This guide provides complete setup instructions for deploying PrintLite with AWS Amplify Gen 2 backend infrastructure. The setup includes authentication, data storage, file uploads, and Lambda functions.

## Prerequisites

1. AWS Account with appropriate permissions
2. Amplify CLI installed (`npm install -g @aws-amplify/cli`)
3. Node.js 18+ installed

## Quick Deployment Steps

### 1. Connect to AWS Amplify

```bash
# Connect your repository to AWS Amplify
# Go to AWS Amplify Console → New App → Deploy web app
# Choose your Git provider and select this repository
```

### 2. Configure Build Settings

The `amplify.yml` file is already configured for Gen 2 deployment:

```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - npm ci --cache .npm --prefer-offline
        - npx amplify backend build
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --cache .npm --prefer-offline
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist/public
    files:
      - '**/*'
  cache:
    paths:
      - .npm/**/*
      - node_modules/**/*
```

### 3. Backend Resources

The PrintLite backend includes:

#### Authentication (`amplify/auth/resource.ts`)
- Cognito User Pool with email authentication
- Admin and User groups
- Password policies

#### Data Storage (`amplify/data/resource.ts`)
- **Order Management**: Complete order tracking with INR pricing
- **User Management**: User profiles and preferences
- **File Tracking**: Uploaded file metadata
- **System Configuration**: Admin settings

#### File Storage (`amplify/storage/resource.ts`)
- S3 bucket with secure access patterns
- User-isolated file uploads
- Public and processed file areas

#### Lambda Functions
- **Calculate Price**: INR pricing calculations with GST
- **Process Payment**: Payment processing integration
- **Update Order Status**: Order status management

### 4. Database Schema

Complete GraphQL schema with Indian pricing:

```typescript
Order: {
  orderNumber: string (required)
  customerName: string (required)
  email: email (required)
  phone: string (required)
  address: string (required)
  paperType: string (required)
  paperQuality: string (required) // 70GSM, 90GSM, 120GSM
  printType: string (required)    // blackwhite, color
  sides: string (required)        // single, double
  copies: integer (required)
  pricePerPage: float (required)  // in INR
  totalPages: integer (required)
  totalAmount: float (required)   // in INR
  currency: string (default: 'INR')
  status: string (default: 'pending')
  paymentMethod: string (required)
  paymentStatus: string (default: 'pending')
  fileNames: [string] (required)
  fileKeys: [string]             // S3 keys
  specialInstructions: string
  adminNotes: string
  deliveryDate: datetime
  userId: string
  createdBy: string (required)
}
```

### 5. Frontend Integration

The frontend automatically detects and uses:
- Gen 2 configuration from `amplify_outputs.json`
- Fallback to environment variables
- Local development mode without AWS

### 6. Pricing Configuration

Lambda function handles Indian pricing:
- **Black & White**: ₹2 per page base
- **Color**: ₹8 per page base
- **Paper Quality**: 70GSM (1.0x), 90GSM (1.2x), 120GSM (1.5x)
- **Double-sided**: 30% discount
- **GST**: 18% tax rate

## Environment Variables

Set these in Amplify Console → App Settings → Environment Variables:

```
NODE_ENV=production
AMPLIFY_DEPLOYMENT=true
```

## Deployment Process

1. **Push to Repository**: Commit all changes to your connected Git branch
2. **Automatic Build**: Amplify will automatically build both backend and frontend
3. **Resource Creation**: AWS resources will be provisioned automatically
4. **Domain Setup**: Configure custom domain in Amplify Console if needed

## Post-Deployment Configuration

### Admin User Setup
1. Go to Cognito User Pool in AWS Console
2. Create admin user with email
3. Add user to "ADMIN" group
4. User will receive temporary password via email

### S3 Bucket Configuration
- CORS is automatically configured
- File upload permissions are set per user
- Admin has access to all files

### Testing the Deployment
1. Visit your Amplify app URL
2. Test file upload functionality
3. Create test orders
4. Verify admin panel access
5. Test payment processing (sandbox mode)

## Troubleshooting

### Build Failures
- Check `amplify.yml` configuration
- Verify all dependencies in `package.json`
- Review build logs in Amplify Console

### Authentication Issues
- Verify Cognito configuration
- Check user group assignments
- Review IAM policies

### File Upload Problems
- Check S3 bucket policies
- Verify CORS configuration
- Test with different file types

## Features Ready for Production

✅ **User Authentication**: Email-based login with Cognito  
✅ **File Uploads**: Secure S3 storage with user isolation  
✅ **Order Management**: Complete order lifecycle tracking  
✅ **Admin Panel**: Order management with INR pricing  
✅ **Payment Integration**: Ready for payment gateway integration  
✅ **Mobile Responsive**: Works on all device sizes  
✅ **SEO Optimized**: Meta tags and social sharing  

## Cost Optimization

- **Auth**: Free tier covers up to 50,000 users
- **Storage**: S3 standard pricing for file storage
- **Database**: DynamoDB on-demand pricing
- **Functions**: Lambda free tier covers initial usage
- **Hosting**: Amplify hosting with generous free tier

## Security Features

- User data isolation in S3
- Admin-only access to sensitive operations
- Secure API endpoints with authentication
- File upload size and type restrictions
- XSS and CSRF protection

Your PrintLite application is now ready for production deployment with full AWS Amplify Gen 2 backend support!