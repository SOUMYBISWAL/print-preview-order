// Demo authentication functionality to test AWS Amplify integration
import { signUp, signIn, signOut, getCurrentUser } from 'aws-amplify/auth';

export async function demoSignUp(email: string, password: string) {
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
        },
      },
    });
    
    console.log('Sign up result:', { isSignUpComplete, userId, nextStep });
    return { success: true, isSignUpComplete, userId, nextStep };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Sign up failed' };
  }
}

export async function demoSignIn(email: string, password: string) {
  try {
    const { isSignedIn, nextStep } = await signIn({
      username: email,
      password,
    });
    
    console.log('Sign in result:', { isSignedIn, nextStep });
    return { success: true, isSignedIn, nextStep };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Sign in failed' };
  }
}

export async function demoSignOut() {
  try {
    await signOut();
    console.log('Sign out successful');
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Sign out failed' };
  }
}

export async function demoGetCurrentUser() {
  try {
    const user = await getCurrentUser();
    console.log('Current user:', user);
    return { success: true, user };
  } catch (error) {
    console.error('Get current user error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Not authenticated' };
  }
}