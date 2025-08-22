import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'printuserfile',
  access: [
    {
      // Allow authenticated users full access
      allow: 'authenticated',
      operations: ['read', 'write', 'delete', 'list'],
    },
    {
      // Allow unauthenticated users to upload and list files
      allow: 'guest',
      operations: ['read', 'write', 'list'],
    }
  ]
});