import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { calculatePriceFunction } from './functions/calculate-price/resource';
import { updateOrderStatusFunction } from './functions/update-order-status/resource';
import { processPaymentFunction } from './functions/process-payment/resource';

/**
 * PrintLite Backend Configuration
 * Complete AWS Amplify Gen 2 backend with all services
 */
export const backend = defineBackend({
  auth,
  data,
  storage,
  calculatePriceFunction,
  updateOrderStatusFunction,
  processPaymentFunction,
});

// Configure storage bucket with CORS
backend.storage.resources.bucket.addCorsRule({
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
  allowedOrigins: ['*'],
  allowedHeaders: ['*'],
  exposedHeaders: ['ETag'],
  maxAge: 3000,
});

// Configure additional policies if needed
const { cfnUserPool } = backend.auth.resources.cfnResources;
cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 8,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: false,
    requireUppercase: true,
  },
};