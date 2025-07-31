import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

interface AmplifyAuthProps {
  children: React.ReactNode;
}

export function AmplifyAuth({ children }: AmplifyAuthProps) {
  return (
    <Authenticator
      signUpAttributes={['email']}
      loginMechanisms={['email']}
      formFields={{
        signIn: {
          email: {
            label: 'Email',
            placeholder: 'Enter your email address',
          },
        },
        signUp: {
          email: {
            label: 'Email',
            placeholder: 'Enter your email address',
            isRequired: true,
          },
          password: {
            label: 'Password',
            placeholder: 'Enter your password',
            isRequired: true,
          },
          confirm_password: {
            label: 'Confirm Password',
            placeholder: 'Confirm your password',
            isRequired: true,
          },
        },
      }}
      components={{
        Header() {
          return (
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">PrintLite</h1>
              <p className="text-gray-600 mt-2">Professional Document Printing Service</p>
            </div>
          );
        },
      }}
    >
      {children}
    </Authenticator>
  );
}

export default AmplifyAuth;