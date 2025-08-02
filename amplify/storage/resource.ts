import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'printliteStorage',
  access: (allow) => ({
    // Public uploads for guest users (documents for printing)
    'public/uploads/*': [
      allow.guest.to(['read', 'write']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
    // User-specific uploads (authenticated users)
    'private/{entity_id}/uploads/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    // Documents folder for processed files
    'public/documents/*': [
      allow.guest.to(['read', 'write']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
    // Admin-only access to all files
    'admin/*': [
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
    // Temporary uploads (can be cleaned up automatically)
    'temp/*': [
      allow.guest.to(['read', 'write']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ]
  })
});