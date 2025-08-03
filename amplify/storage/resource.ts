import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'PrintLiteStorage',
  access: (allow) => ({
    // Document uploads - for PDF, DOC, DOCX files to be printed
    'documents/*': [
      allow.guest.to(['read', 'write']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ],

    // File uploads - temporary storage for upload processing
    'uploads/*': [
      allow.guest.to(['read', 'write']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ],

    // Order files - linked to specific orders
    'orders/{entity_id}/*': [
      allow.guest.to(['read', 'write']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ],

    // Public files - for static assets and public documents
    'public/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ]
  })
});