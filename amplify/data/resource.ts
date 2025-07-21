// AWS Amplify Gen 2 Data Configuration
export const dataConfig = {
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
    },
    User: {
      fields: {
        id: 'ID!',
        username: 'String!',
        email: 'AWSEmail!',
      },
      authorization: [
        'allow owner',
        'allow authenticated to read'
      ]
    }
  },
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
};