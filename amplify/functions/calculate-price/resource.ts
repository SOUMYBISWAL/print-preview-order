import { defineFunction } from '@aws-amplify/backend';

export const calculatePriceFunction = defineFunction({
  name: 'calculatePrice',
  entry: './handler.ts'
});