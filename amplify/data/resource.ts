// AWS Amplify Gen 2 Data Configuration (GraphQL API)
export const data = {
  schema: {
    Order: {
      fields: {
        id: { type: 'ID', key: 'primary' },
        customerName: { type: 'String', required: true },
        email: { type: 'String', required: true },
        phone: { type: 'String', required: true },
        totalAmount: { type: 'Float', required: true },
        status: { type: 'String', required: true },
        totalPages: { type: 'Int', required: true },
        printType: { type: 'String', required: true },
        paperSize: { type: 'String', required: true },
        paperType: { type: 'String', required: true },
        sides: { type: 'String', required: true },
        binding: { type: 'String' },
        copies: { type: 'Int', required: true },
        deliveryAddress: { type: 'String', required: true },
        paymentMethod: { type: 'String', required: true },
        paymentStatus: { type: 'String', required: true },
        fileNames: { type: '[String]', required: true },
        specialInstructions: { type: 'String' },
        createdAt: { type: 'AWSDateTime' },
        updatedAt: { type: 'AWSDateTime' },
      },
      authorization: [
        { type: 'guest', operations: ['create', 'read'] },
        { type: 'group', group: 'ADMIN', operations: ['create', 'read', 'update', 'delete'] },
      ]
    },
    PrintSettings: {
      fields: {
        id: { type: 'ID', key: 'primary' },
        paperType: { type: 'String', required: true },
        color: { type: 'String', required: true },
        sides: { type: 'String', required: true },
        binding: { type: 'String' },
        copies: { type: 'Int', required: true },
        pricePerPage: { type: 'Float', required: true },
        createdAt: { type: 'AWSDateTime' },
        updatedAt: { type: 'AWSDateTime' },
      },
      authorization: [
        { type: 'guest', operations: ['read'] },
        { type: 'group', group: 'ADMIN', operations: ['create', 'read', 'update', 'delete'] },
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