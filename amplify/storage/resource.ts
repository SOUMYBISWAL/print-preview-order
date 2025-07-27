// AWS Amplify Gen 2 Storage Configuration (S3)
export const storage = {
  name: 'printliteStorage',
  access: {
    'uploads/*': [
      { type: 'guest', operations: ['read', 'write'] },
      { type: 'authenticated', operations: ['read', 'write', 'delete'] },
    ],
    'public/*': [
      { type: 'guest', operations: ['read'] },
      { type: 'authenticated', operations: ['read', 'write', 'delete'] },
    ],
  },
};