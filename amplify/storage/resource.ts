import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'printliteStorage',
  access: (allow) => ({
    'uploads/*': [
      allow.guest.to(['read', 'write']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
    'public/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
    'documents/*': [
      allow.guest.to(['read', 'write']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ]
  })
});