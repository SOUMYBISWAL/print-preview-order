// AWS Amplify Gen 2 Backend Configuration
// This file will be used when deploying to AWS Amplify
// The actual implementation requires @aws-amplify/backend package

export const backendConfig = {
  auth: {
    loginWith: {
      email: true,
    },
    userAttributes: {
      email: {
        required: true,
      },
    },
  },
  data: {
    schema: {
      Order: {
        fields: {
          id: 'ID!',
          customerName: 'String!',
          email: 'AWSEmail!',
          phone: 'String!',
          totalAmount: 'Float!',
          status: 'String',
          totalPages: 'Int!',
          printType: 'String!',
          paperSize: 'String!',
          paperType: 'String!',
          sides: 'String!',
          binding: 'String',
          copies: 'Int',
          deliveryAddress: 'String!',
          paymentMethod: 'String!',
          paymentStatus: 'String',
          fileNames: '[String!]!',
          specialInstructions: 'String',
          userId: 'String',
          createdAt: 'AWSDateTime',
          updatedAt: 'AWSDateTime',
        },
        authorization: [
          'allow guest to create, read',
          'allow authenticated to create, read, update',
          'allow owner'
        ]
      }
    }
  },
  storage: {
    name: 'PrintLiteStorage',
    access: {
      'documents/*': ['guest: read, write', 'authenticated: read, write, delete'],
      'uploads/*': ['guest: read, write', 'authenticated: read, write, delete'],
    }
  }
};