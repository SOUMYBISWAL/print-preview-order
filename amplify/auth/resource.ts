// AWS Amplify Gen 2 Auth Configuration
export const authConfig = {
  loginWith: {
    email: true,
  },
  userAttributes: {
    email: {
      required: true,
    },
  },
};