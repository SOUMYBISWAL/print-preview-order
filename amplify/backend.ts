import { defineBackend } from '@aws-amplify/backend';
import { storage } from './storage/resource';

const backend = defineBackend({
  storage,
});