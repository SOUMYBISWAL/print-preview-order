import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'printliteStorage',
  access: (allow: any) => ({
    'uploads/*': [
      allow.guest.to(['read', 'write']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'processed/*': [
      allow.authenticated.to(['read']),
      allow.groups(['ADMIN']).to(['read', 'write', 'delete']),
    ],
  }),
});