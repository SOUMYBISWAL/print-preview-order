import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Order: a
    .model({
      id: a.id(),
      customerName: a.string().required(),
      customerPhone: a.string().required(),
      customerEmail: a.string(),
      deliveryAddress: a.string().required(),
      items: a.json().required(),
      totalAmount: a.float().required(),
      status: a.enum(['pending', 'processing', 'printing', 'shipped', 'delivered']),
      paymentMethod: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow: any) => [
      allow.guest().to(['create', 'read']),
      allow.group('ADMIN').to(['create', 'read', 'update', 'delete']),
    ]),

  PrintSettings: a
    .model({
      id: a.id(),
      paperType: a.string().required(),
      printColor: a.string().required(),
      printSides: a.string().required(),
      binding: a.string(),
      copies: a.integer().required(),
      pricePerPage: a.float().required(),
    })
    .authorization((allow: any) => [
      allow.guest().to(['read']),
      allow.group('ADMIN').to(['create', 'read', 'update', 'delete']),
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