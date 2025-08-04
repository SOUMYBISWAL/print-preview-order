import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { storage } from './storage/resource';

export const backend = defineBackend({
  resources: [auth, storage],
});
import { storage } from './storage/resource';
defineBackend({
  auth,
  storage
});