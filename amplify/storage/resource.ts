// AWS Amplify Gen 2 Storage Configuration
export const storageConfig = {
  name: 'PrintLiteStorage',
  access: {
    'documents/*': [
      'guest: read, write',
      'authenticated: read, write, delete',
    ],
    'uploads/*': [
      'guest: read, write', 
      'authenticated: read, write, delete',
    ],
  },
};