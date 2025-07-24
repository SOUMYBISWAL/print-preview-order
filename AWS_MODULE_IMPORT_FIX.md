# AWS Amplify Backend Module Import Fix

## Issue
AWS Amplify Gen 2 backend deployment failing with Node.js runtime error:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module './amplify/dist/auth/resource' imported from /codebuild/output/.../amplify/dist/backend.js
```

## Root Cause
Modern Node.js (v18+) with ES modules requires explicit file extensions in import statements. When TypeScript compiles to JavaScript, it preserves the import paths exactly as written, but Node.js runtime requires the `.js` extension for ES modules.

## Solution Applied

### 1. Updated Import Statements in backend.ts
Changed from:
```typescript
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
```

To:
```typescript
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource.js';
import { calculatePriceFunction } from './functions/calculate-price/resource.js';
import { processPaymentFunction } from './functions/process-payment/resource.js';
import { updateOrderStatusFunction } from './functions/update-order-status/resource.js';
```

### 2. Added Lambda Functions to Backend Definition
Updated the backend configuration to include all Lambda functions:
```typescript
export const backend = defineBackend({
  auth,
  data,
  storage,
  calculatePriceFunction,
  processPaymentFunction,
  updateOrderStatusFunction,
});
```

## Why This Works
- TypeScript compiler converts `.ts` files to `.js` during compilation
- When TypeScript sees `import ... from './auth/resource.js'`, it compiles correctly
- Node.js runtime can then find the actual `.js` files in the dist directory
- This approach tells the TypeScript compiler to preserve the `.js` extension in the output

## Deployment Status
- Backend configuration updated with proper ES module imports
- All Lambda functions now properly included in backend definition
- Ready for AWS Amplify deployment

The Node.js module import error should now be resolved.