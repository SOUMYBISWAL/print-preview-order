import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'PrintLiteStorage',
  access: (allow) => ({
    'documents/*': [
      allow.guest.to(['read', 'write', 'delete']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
    'public/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ]
  })
});