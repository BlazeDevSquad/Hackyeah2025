import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

import * as AppleAuthentication from 'expo-apple-authentication';
import Toast from 'react-native-root-toast';
import { Colors } from '@/constants/Colors';
import { showToast } from '@/helpers/app-functions';
import { useHmac } from '@/hooks/useHmac';
import {
  FirebaseAuthTypes,
  sendEmailVerification,
  getAuth,
  onIdTokenChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  signInWithCredential,
  createUserWithEmailAndPassword,
  getIdTokenResult,
} from '@react-native-firebase/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const auth = getAuth();

// --- Auth State Context ---
// This context will only hold the user's authentication state.
// Actions that modify this state will be handled by React Query mutations.

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  idToken: string | null;
  initialized: boolean;
  handleShowPassword: () => void;
  showPassword: boolean;
  activeEntitlements: string[] | null;
  refreshIdToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeEntitlements, setActiveEntitlements] = useState<string[] | null>(
    null
  );
  const { checkHmacSecret } = useHmac();

  // onIdTokenChanged is the source of truth for the user's auth state and token claims.
  // It fires on sign-in, sign-out, and whenever the token is refreshed.
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // User is signed in or token has been refreshed.
        checkHmacSecret(firebaseUser.uid);
        try {
          const tokenResult = await firebaseUser.getIdTokenResult();
          // Note: 'activeEntitlements' is assumed to be the correct custom claim name.
          const entitlements =
            (tokenResult.claims.activeEntitlements as string[]) || [];
          setActiveEntitlements(entitlements);
          setIdToken(tokenResult.token);
        } catch (error) {
          console.error('Error getting ID token result:', error);
          setActiveEntitlements(null);
          setIdToken(null);
        }
      } else {
        // User is signed out.
        setIdToken(null);
        setActiveEntitlements(null);
      }

      if (!initialized) {
        setInitialized(true);
      }
    });
    return unsubscribe;
  }, [initialized, checkHmacSecret]);

  // Function to force-refresh the user's ID token.
  // The onIdTokenChanged listener will handle the new token and update the state.
  const refreshIdToken = useCallback(async () => {
    if (user) {
      try {
        await user.getIdToken(true); // This forces a token refresh.
      } catch (error) {
        console.error('Error forcing ID token refresh:', error);
      }
    }
  }, [user]);

  const handleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const value = {
    user,
    idToken,
    initialized,
    handleShowPassword,
    showPassword,
    activeEntitlements,
    refreshIdToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- React Query Mutation Hooks for Authentication ---

// A generic error handler for mutations
const handleAuthError = (error: Error) => {
  let errorMessage = error.message;
  if (error.message.includes('[auth/')) {
    const errorCode = error.message.match(/\[auth\/(.*?)\]/)?.[1];
    if (errorCode) {
      errorMessage = errorCode;
    }
  }
  showToast(errorMessage, true, Colors.light.error);
};

// Hook for Signing In with Email and Password
export const useSignIn = () => {
  return useMutation({
    mutationFn: ({ email, password }: any) =>
      signInWithEmailAndPassword(auth, email, password),
    onSuccess: () => {
      showToast('Signed in successfully!', false, Colors.light.success);
    },
    onError: handleAuthError,
  });
};

// Hook for Signing Up with Email and Password
export const useSignUp = () => {
  return useMutation({
    mutationFn: async ({ email, password }: any) => {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);
      return userCredential;
    },
    onSuccess: () => {
      showToast(
        'Signed up successfully! Please check your email to verify your account.',
        false,
        Colors.light.success
      );
    },
    onError: handleAuthError,
  });
};

// Hook for Signing Out
export const useSignOut = () => {
  return useMutation({
    mutationFn: () => signOut(auth),
    onSuccess: () => {
      showToast('Signed out.', false, Colors.light.black);
    },
    onError: handleAuthError,
  });
};

// Hook for sending a password reset email
export const useSendPasswordReset = () => {
  return useMutation({
    mutationFn: (email: string) => sendPasswordResetEmail(auth, email),
    onSuccess: () => {
      showToast('Password reset link sent to your email.', false, Colors.light.success);
    },
    onError: handleAuthError,
  });
};

// Hook for Anonymous Sign-Up
export const useSignUpAnonymously = () => {
  return useMutation({
    mutationFn: () => signInAnonymously(auth),
    onError: handleAuthError,
  });
};

// Hook for signing in with Apple
export const useSignInWithApple = () => {
  return useMutation({
    mutationFn: async () => {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (!credential.identityToken) {
        throw new Error('Apple authentication failed: No identity token');
      }
      const appleCredential = {
        providerId: 'apple.com',
        token: credential.identityToken,
        secret: credential.authorizationCode ?? '',
      };
      return signInWithCredential(auth, appleCredential);
    },
    onError: handleAuthError,
  });
};
