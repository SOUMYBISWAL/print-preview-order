import { defineFunction } from '@aws-amplify/backend';

export const updateOrderStatusFunction = defineFunction({
  name: 'updateOrderStatus',
  entry: './handler.ts'
});