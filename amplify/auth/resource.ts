// AWS Amplify Gen 2 Authentication Configuration
export const auth = {
  loginWith: {
    email: true,
  },
  groups: ['ADMIN', 'USER'],
  signUpAttributes: ['email'],
  userAttributes: {
    email: { required: true, mutable: true },
    name: { required: false, mutable: true },
  },
};