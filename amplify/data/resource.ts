import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Order: a.model({
    id: a.id(),
    userId: a.string(),
    guestEmail: a.string().optional(),
    fileName: a.string().required(),
    fileUrl: a.string().required(),
    pages: a.integer().required(),
    paperType: a.string().required(),
    colorType: a.string().required(),
    printSides: a.string().required(),
    bindingType: a.string().required(),
    copies: a.integer().required(),
    totalPrice: a.float().required(),
    status: a.string().required(),
    deliveryAddress: a.string().required(),
    phone: a.string().required(),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
  }).authorization(allow => [
    allow.authenticated(),
    allow.guest().to(['create', 'read'])
  ]),
  
  PrintSettings: a.model({
    id: a.id(),
    fileName: a.string().required(),
    fileUrl: a.string().required(),
    pages: a.integer().required(),
    paperType: a.string().required(),
    colorType: a.string().required(),
    printSides: a.string().required(),
    bindingType: a.string().required(),
    copies: a.integer().required(),
    totalPrice: a.float().required(),
    createdAt: a.datetime(),
  }).authorization(allow => [
    allow.authenticated(),
    allow.guest().to(['create', 'read', 'update', 'delete'])
  ])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});