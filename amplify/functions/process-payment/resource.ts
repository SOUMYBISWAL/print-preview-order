import { defineFunction } from '@aws-amplify/backend';

export const processPayment = defineFunction({
  name: 'processPayment',
  entry: './handler.ts'
});