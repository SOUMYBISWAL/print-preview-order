import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * Define and configure your data resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/data
 */
const schema = a.schema({
  Order: a
    .model({
      customerName: a.string().required(),
      email: a.email().required(),
      phone: a.string().required(),
      totalAmount: a.float().required(),
      status: a.string().default('pending'),
      totalPages: a.integer().required(),
      printType: a.string().required(),
      paperSize: a.string().required(),
      paperType: a.string().required(),
      sides: a.string().required(),
      binding: a.string(),
      copies: a.integer().default(1),
      deliveryAddress: a.string().required(),
      paymentMethod: a.string().required(),
      paymentStatus: a.string().default('pending'),
      fileNames: a.string().array().required(),
      specialInstructions: a.string(),
      userId: a.string(),
    })
    .authorization((allow) => [
      allow.guest(),
      allow.authenticated(),
      allow.owner(),
    ]),

  User: a
    .model({
      username: a.string().required(),
      email: a.email().required(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
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