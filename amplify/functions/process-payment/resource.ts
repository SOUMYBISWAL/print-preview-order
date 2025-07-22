import { defineFunction } from '@aws-amplify/backend';

export const processPaymentFunction = defineFunction({
  name: 'processPayment',
  entry: './handler.ts'
});