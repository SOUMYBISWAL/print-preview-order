import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

/**
 * PrintLite Backend Configuration
 * AWS Amplify Gen 2 backend with core services
 */
export const backend = defineBackend({
  auth,
  data,
  storage,
});

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