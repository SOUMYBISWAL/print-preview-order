import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * PrintLite Database Schema
 * Complete schema for printing service with file uploads, orders, and admin management
 */
const schema = a.schema({
  // Enhanced Order model with all PrintLite features
  Order: a
    .model({
      orderNumber: a.string().required(),
      customerName: a.string().required(),
      email: a.email().required(),
      phone: a.string().required(),
      address: a.string().required(),
      
      // Print settings
      paperType: a.string().required(),
      paperQuality: a.string().required(),
      printType: a.string().required(),
      sides: a.string().required(),
      copies: a.integer().required(),
      
      // Pricing in INR
      pricePerPage: a.float().required(),
      totalPages: a.integer().required(),
      totalAmount: a.float().required(),
      currency: a.string().default('INR'),
      
      // Order status management
      status: a.string().default('pending'),
      paymentMethod: a.string().required(),
      paymentStatus: a.string().default('pending'),
      
      // File information
      fileNames: a.string().array().required(),
      fileKeys: a.string().array(), // S3 keys for uploaded files
      
      // Additional details
      specialInstructions: a.string(),
      adminNotes: a.string(),
      deliveryDate: a.datetime(),
      
      // User association
      userId: a.string(),
      createdBy: a.string().required(),
    })
    .authorization((allow) => [
      allow.guest().to(['create']),
      allow.authenticated().to(['create', 'read']),
      allow.owner().to(['read', 'update']),
      allow.group('admin'),
    ]),

  // User management
  User: a
    .model({
      username: a.string().required(),
      email: a.email().required(),
      name: a.string(),
      phone: a.string(),
      address: a.string(),
      role: a.string().default('user'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.group('admin'),
      allow.authenticated().to(['read']),
    ]),

  // File uploads tracking
  UploadedFile: a
    .model({
      fileName: a.string().required(),
      fileKey: a.string().required(), // S3 key
      fileSize: a.integer(),
      fileType: a.string(),
      pageCount: a.integer(),
      uploadedBy: a.string().required(),
      orderId: a.string(), // Associated order
    })
    .authorization((allow) => [
      allow.owner(),
      allow.group('admin'),
      allow.authenticated().to(['create', 'read']),
    ]),

  // System configuration for admin
  SystemConfig: a
    .model({
      key: a.string().required(),
      value: a.string().required(),
      description: a.string(),
      category: a.string().default('general'),
      updatedBy: a.string(),
    })
    .authorization((allow) => [
      allow.group('admin'),
    ]),


});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});