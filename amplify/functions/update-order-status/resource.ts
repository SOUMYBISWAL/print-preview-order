import { defineFunction } from '@aws-amplify/backend';

export const updateOrderStatus = defineFunction({
  name: 'updateOrderStatus',
  entry: './handler.ts'
});