import { defineFunction } from '@aws-amplify/backend';

export const calculatePrice = defineFunction({
  name: 'calculatePrice',
  entry: './handler.ts'
});