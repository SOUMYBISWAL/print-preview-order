import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource.js';
import { calculatePrice } from './functions/calculate-price/resource.js';
import { processPayment } from './functions/process-payment/resource.js';
import { updateOrderStatus } from './functions/update-order-status/resource.js';

/**
 * PrintLite Backend Configuration
 * AWS Amplify Gen 2 backend with core services and Lambda functions
 */
const backend = defineBackend({
  auth,
  data,
  storage,
  calculatePrice,
  processPayment,
  updateOrderStatus,
});

// Export the backend as default
export default backend;

// Configure user pool policies
try {
  const { cfnUserPool } = backend.auth.resources.cfnResources;
  if (cfnUserPool) {
    cfnUserPool.policies = {
      passwordPolicy: {
        minimumLength: 8,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: false,
        requireUppercase: true,
      },
    };
  }
} catch (error) {
  console.warn('User pool configuration skipped:', error.message);
}