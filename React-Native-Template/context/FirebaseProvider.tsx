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
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  signInWithCredential,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';

// TODO: Uncomment this if you want to use Google Sign In
// import { Platform } from 'react-native';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

const auth = getAuth();

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  idToken: string | null;
  initialized: boolean;
  signOutHandler: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  handleShowPassword: () => void;
  isLoading: boolean;
  error: string | null;
  showPassword: boolean;
  handleError: (error: Error) => void;
  sendNewPasswordLink: (email: string) => Promise<void>;
  signUpAnonymously: () => Promise<void>;
};

// TODO: Uncomment this if you want to use Google Sign In
// if (Platform.OS !== 'web') {
//   GoogleSignin.configure();
// }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { checkHmacSecret } = useHmac();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseAuthTypes.User | null) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          setInitialized(true);
        } else {
          setUser(null);
          setInitialized(true);
        }
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const getToken = async () => {
      if (user) {
        checkHmacSecret(user.uid);
        const token = await user.getIdToken();
        console.log('token', token);
        setIdToken(token);
      }
    };
    getToken();
  }, [user]);

  const handleError = useCallback(
    (error: Error) => {
      let errorMessage = error.message;

      // Handle token expiration
      if (error.message === 'AUTH_TOKEN_EXPIRED') {
        // Refresh token
        user?.getIdToken(true).then((newToken: string) => {
          setIdToken(newToken);
        });
      }
      // Firebase auth error handling
      else if (error.message.includes('[auth/')) {
        // Extract error code from format: [auth/error-code] Error message
        const errorCode = error.message.match(/\[auth\/(.*?)\]/)?.[1];

        if (errorCode) {
          errorMessage = errorCode;
        }
      }

      setError(errorMessage);
      showToast(errorMessage, true, Colors.light.error);
    },
    [user]
  );

  const handleAuthAction = useCallback(
    async (action: () => Promise<void>, loadingMessage: string) => {
      let toast = showToast(loadingMessage, false, Colors.light.black);
      try {
        setIsLoading(true);
        await action();
      } catch (error) {
        handleError(error as Error);
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          Toast.hide(toast);
        }, 1000);
      }
    },
    [handleError]
  );

  // Anonymous sign up with device tracking
  const signUpAnonymously = useCallback(async () => {
    await handleAuthAction(async () => {
      await signInAnonymously(auth);
    }, 'Signing up anonymously');
  }, [handleAuthAction]);

  const signIn = useCallback(
    (email: string, password: string) =>
      handleAuthAction(async () => {
        await signInWithEmailAndPassword(auth, email, password);
      }, 'Signing in'),
    [handleAuthAction]
  );

  const signUp = useCallback(
    (email: string, password: string) =>
      handleAuthAction(async () => {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (userCredential.user) {
          await sendEmailVerification(userCredential.user);
        }
      }, 'Signing up'),
    [handleAuthAction]
  );

  const signOutHandler = useCallback(async () => {
    await handleAuthAction(async () => {
      // TODO: Uncomment this if you want to use Google Sign In
      // await GoogleSignin.signOut();
      await signOut(auth);
      // Manually update states immediately
      setUser(null);
      setIdToken(null);
    }, 'Signing out');
  }, [handleAuthAction]);

  const sendNewPasswordLink = useCallback(
    async (email: string) => {
      await handleAuthAction(async () => {
        await sendPasswordResetEmail(auth, email);
      }, 'Sending reset password link');
    },
    [handleAuthAction]
  );

  const signInWithGoogle = useCallback(async () => {
    const toast = showToast(
      'Signing in with Google',
      false,
      Colors.light.black
    );
    try {
      setIsLoading(true);
      // TODO: Uncomment this if you want to use Google Sign In
      // await GoogleSignin.hasPlayServices({
      //   showPlayServicesUpdateDialog: true,
      // });
      // const signInResult = await GoogleSignin.signIn();
      // let idToken = signInResult.data?.idToken;
      // if (!idToken) {
      //   throw new Error('No ID token found');
      // }
      // const googleCredential: FirebaseAuthTypes.AuthCredential = {
      //   providerId: 'google.com',
      //   token: idToken,
      //   secret: '',
      // };
      // await signInWithCredential(auth, googleCredential);

      // TODO: Then you can delete this toast:
      showToast(
        'You need to Activate Google Sign In FIRST',
        true,
        Colors.light.error
      );
    } catch (error) {
      handleError(error as Error);
    } finally {
      setIsLoading(false);
      Toast.hide(toast);
    }
  }, [handleError]);

  const signInWithApple = useCallback(async () => {
    const toast = showToast('Signing in with Apple', false, Colors.light.black);
    try {
      setIsLoading(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (!credential.identityToken) {
        throw new Error('Apple authentication failed');
      }
      const appleCredential: FirebaseAuthTypes.AuthCredential = {
        providerId: 'apple.com',
        token: credential.identityToken,
        secret: credential.authorizationCode ?? '',
      };

      await signInWithCredential(auth, appleCredential);
    } catch (error) {
      handleError(error as Error);
    } finally {
      setIsLoading(false);
      Toast.hide(toast);
    }
  }, [handleError]);

  const handleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const value = {
    user,
    idToken,
    initialized,
    signOutHandler,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    handleShowPassword,
    isLoading,
    error,
    showPassword,
    handleError,
    sendNewPasswordLink,
    signUpAnonymously,
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
