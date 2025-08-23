import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'userfiles',
  access: (grant) => [
    grant('authenticated').to(['read', 'write', 'delete', 'list']).level('protected'),
    grant('guest').to(['read', 'write', 'list']).level('public')
  ]
});