// AWS Amplify Gen 2 Backend Configuration
// This file defines the backend resources for PrintLite

export const backend = {
  auth: {
    loginWith: {
      email: true,
    },
    groups: ['ADMIN', 'USER'],
  },
  data: {
    schema: {
      Order: {
        customerName: { type: 'string', required: true },
        email: { type: 'string', required: true },
        phone: { type: 'string', required: true },
        totalAmount: { type: 'float', required: true },
        status: { type: 'string', required: true },
        totalPages: { type: 'integer', required: true },
        printType: { type: 'string', required: true },
        paperSize: { type: 'string', required: true },
        paperType: { type: 'string', required: true },
        sides: { type: 'string', required: true },
        binding: { type: 'string' },
        copies: { type: 'integer', required: true },
        deliveryAddress: { type: 'string', required: true },
        paymentMethod: { type: 'string', required: true },
        paymentStatus: { type: 'string', required: true },
        fileNames: { type: 'string[]', required: true },
        specialInstructions: { type: 'string' },
      },
      PrintSettings: {
        paperType: { type: 'string', required: true },
        color: { type: 'string', required: true },
        sides: { type: 'string', required: true },
        binding: { type: 'string' },
        copies: { type: 'integer', required: true },
        pricePerPage: { type: 'float', required: true },
      }
    }
  },
  storage: {
    name: 'printliteStorage',
    access: {
      'uploads/*': ['guest:read,write', 'authenticated:read,write,delete'],
    },
  },
};