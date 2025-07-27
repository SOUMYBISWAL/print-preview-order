import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

/**
 * PrintLite Backend - AWS Amplify Gen 2
 */
export const backend = defineBackend({
  auth,
  data,
  storage,
});