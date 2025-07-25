import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource.js';

/**
 * PrintLite Backend Configuration
 * AWS Amplify Gen 2 backend with core services
 */
const backend = defineBackend({
  auth,
  data,
  storage,
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