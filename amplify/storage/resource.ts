import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'amplifyTeamDrive',
  access: [
    {
      allow: 'authenticated',
      operations: ['read', 'write', 'delete', 'list'],
      level: 'protected'
    },
    {
      allow: 'guest',
      operations: ['read', 'write', 'list'],
      level: 'public'
    }
  ]
});