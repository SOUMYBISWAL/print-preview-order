import { useState, useEffect } from 'react';
import { signIn, signUp, signOut, getCurrentUser, type AuthUser } from 'aws-amplify/auth';

export interface AmplifyAuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAmplifyAuth() {
  const [authState, setAuthState] = useState<AmplifyAuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const user = await getCurrentUser();
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { isSignedIn } = await signIn({
        username: email,
        password,
      });
      
      if (isSignedIn) {
        await checkAuthState();
        return { success: true };
      }
      
      return { success: false, error: 'Sign in failed' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Sign in failed' 
      };
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      const { isSignUpComplete } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });

      return { 
        success: true, 
        isComplete: isSignUpComplete,
        message: isSignUpComplete ? 'Account created successfully!' : 'Please check your email for verification code'
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Sign up failed' 
      };
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Sign out failed' 
      };
    }
  };

  return {
    ...authState,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    checkAuthState,
  };
}