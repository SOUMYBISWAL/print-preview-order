import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource.js';
import { calculatePriceFunction } from './functions/calculate-price/resource.js';
import { processPaymentFunction } from './functions/process-payment/resource.js';
import { updateOrderStatusFunction } from './functions/update-order-status/resource.js';

/**
 * PrintLite Backend Configuration
 * AWS Amplify Gen 2 backend with core services
 */
const backend = defineBackend({
  auth,
  data,
  storage,
  calculatePriceFunction,
  processPaymentFunction,
  updateOrderStatusFunction,
});

export default backend;

// Configure CORS for the storage bucket (if it's a new bucket)
// Note: CORS configuration is now handled in the storage resource definition

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