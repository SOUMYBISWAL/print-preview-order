import { defineStorage } from '@aws-amplify/backend';

/**
 * PrintLite Storage Configuration
 * Secure file storage for user uploads and admin management
 */
export const storage = defineStorage({
  name: 'printliteStorage',
  access: (allow) => ({
    // User uploaded files - users can upload and read their own files
    'uploads/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.group('admin').to(['read', 'write', 'delete']),
    ],
    
    // Public files accessible to all users
    'public/*': [
      allow.authenticated.to(['read']),
      allow.guest.to(['read']),
      allow.group('admin').to(['read', 'write', 'delete']),
    ],
    
    // Admin-only files for system use
    'admin/*': [
      allow.group('admin').to(['read', 'write', 'delete']),
    ],
    
    // Print job files - accessible by order owner and admin
    'orders/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write']),
      allow.group('admin').to(['read', 'write', 'delete']),
    ],
    
    // Processed files for download
    'processed/*': [
      allow.authenticated.to(['read']),
      allow.group('admin').to(['read', 'write', 'delete']),
    ]
  })
});