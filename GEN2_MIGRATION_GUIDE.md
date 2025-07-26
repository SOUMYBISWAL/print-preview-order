# AWS Amplify Gen 2 Migration Guide

## Overview

This guide explains how to migrate your PrintLite application from AWS Amplify Gen 1 to Gen 2. The migration provides better TypeScript support, improved developer experience, and modern AWS service integration.

## What's Changed

### 1. Backend Structure
- **Gen 1**: Used CloudFormation templates and `amplify/` CLI structure
- **Gen 2**: Uses TypeScript-based configuration in `amplify/` directory

### 2. File Upload System
- **Gen 1**: Used `Storage.put()` and complex S3 configuration
- **Gen 2**: Uses `uploadData()` with simplified storage access patterns

### 3. Data Client
- **Gen 1**: GraphQL with manual schema and resolvers
- **Gen 2**: Auto-generated TypeScript client with `client.models.Order.create()`

## Migration Steps

### Step 1: Delete Gen 1 Backend Environments

Before deploying Gen 2, you must manually delete existing Gen 1 backend environments:

1. Go to AWS Amplify Console
2. Navigate to your app
3. Click "Manage backends" 
4. Delete all existing backend environments
5. Confirm deletion (this cannot be undone)

### Step 2: Deploy Gen 2 Backend

After deleting Gen 1 environments:

1. **Connect Repository**: Link your updated GitHub repository to AWS Amplify
2. **Auto-Detection**: Amplify will detect the new `amplify/` structure
3. **Build Process**: The new `amplify.yml` will handle both backend and frontend deployment
4. **Configuration**: Gen 2 resources will be created automatically

### Step 3: File Upload Migration

The new `Gen2FileUploader` component provides:

- **Better Error Handling**: Clear feedback for upload failures
- **Progress Tracking**: Visual progress bars for file uploads
- **Fallback Support**: Works with localStorage when AWS isn't configured
- **Type Safety**: Full TypeScript support for upload operations

### Step 4: Admin Panel Integration

The admin panel now works with Gen 2 data:

- **Real-time Updates**: Orders sync across all admin instances
- **Type-safe Operations**: All CRUD operations are fully typed
- **Better Performance**: Optimized queries and mutations

## New Features in Gen 2

### Enhanced File Management
```typescript
// Gen 2 Upload
const result = await uploadData({
  key: `uploads/${Date.now()}-${file.name}`,
  data: file,
  options: {
    accessLevel: 'guest',
    contentType: file.type,
  }
}).result;
```

### Type-safe Data Operations
```typescript
// Gen 2 Data Client
const result = await client.models.Order.create({
  customerName: "John Doe",
  email: "john@example.com",
  // All fields are type-checked
});
```

### Simplified Configuration
- No manual GraphQL schema writing
- Automatic TypeScript type generation
- Built-in authorization patterns

## Deployment Configuration

### Updated amplify.yml
```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - npm ci --cache .npm --prefer-offline
        - npx amplify push --yes
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
```

## Backward Compatibility

The application maintains backward compatibility:

- **Gen 1 Fallback**: If Gen 2 isn't available, falls back to Gen 1 GraphQL
- **localStorage Fallback**: Works without any AWS configuration
- **Progressive Enhancement**: Features work at different levels based on available services

## Troubleshooting

### Backend Environment Issues
If you see "Backend Environments must be manually deleted":
1. Follow Step 1 above to delete Gen 1 environments
2. Wait 5-10 minutes for AWS to process the deletion
3. Try deploying again

### File Upload Issues
- Check S3 bucket permissions in the Gen 2 storage configuration
- Verify CORS settings allow your domain
- Test with smaller files first

### Admin Panel Data Issues
- Ensure you're using the same AWS region for all services
- Check that the Data API is deployed and accessible
- Verify authentication is working properly

## Benefits of Gen 2

1. **Better Developer Experience**: Full TypeScript support throughout
2. **Simplified Architecture**: Less configuration, more convention
3. **Improved Performance**: Optimized GraphQL operations
4. **Modern AWS Integration**: Latest AWS service features
5. **Enhanced Security**: Built-in authorization patterns

## Next Steps

After successful migration:
1. Test all file upload functionality
2. Verify admin panel operations
3. Check order creation and tracking
4. Monitor performance and error rates
5. Update any custom integrations

The migration to Gen 2 provides a more robust, scalable foundation for your PrintLite application while maintaining all existing functionality.