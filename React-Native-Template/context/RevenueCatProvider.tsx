import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import Purchases, {
  PurchasesPackage,
  CustomerInfo,
} from 'react-native-purchases';

// TODO: Uncomment this if you are using Anonymous Sign In
// import { useAuth } from './FirebaseProvider';
// import * as Application from 'expo-application';
// import uuid from 'react-native-uuid';

const APIKeys = {
  apple: process.env.EXPO_PUBLIC_RC_APPLE_KEY as string,
  google: process.env.EXPO_PUBLIC_RC_GOOGLE_KEY as string,
};

interface RevenueCatContextType {
  packages: PurchasesPackage[];
  isReady: boolean;
  error: string | null | undefined;
  initializeRevenueCat: () => Promise<void>;
  purchasePackage: (pack: PurchasesPackage) => Promise<string>;
  restorePurchases: () => Promise<CustomerInfo>;
  isLoading: boolean;
}

const RevenueCatContext = createContext<RevenueCatContextType | undefined>(
  undefined
);

export const RevenueCatProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(false);
  // TODO: Uncomment this if you are using Firebase Auth
  // const { user } = useAuth();

  // TODO: Uncomment this if you are using an Auth
  // const [appUserID, setAppUserID] = useState<string>(uuid.v4());

  //* Recommended if you are using an Auth
  // useEffect(() => {
  //   async function setupAppUserID() {
  //     if (Platform.OS === 'ios') {
  //       const iosId = await Application.getIosIdForVendorAsync();
  //       setAppUserID(iosId || uuid.v4());
  //     } else {
  //       setAppUserID(Application.getAndroidId() || uuid.v4());
  //     }
  //   }
  //   setupAppUserID();
  // }, []);

  //* If you are using Firebase Auth, you can use the user's ID as the appUserID
  // useEffect(() => {
  //   if (user) {
  //     setAppUserID(user.uid);
  //   }
  // }, [user]);

  //* or you can use the user's email as the appUserID
  // useEffect(() => {
  //   if (user) {
  //     setAppUserID(user.email || uuid.v4());
  //   }
  // }, [user]);

  const initializeRevenueCat = async () => {
    try {
      if (Platform.OS === 'android') {
        Purchases.configure({
          apiKey: APIKeys.google,
          // appUserID: appUserID,
        });
      } else {
        Purchases.configure({
          apiKey: APIKeys.apple,
          // appUserID: appUserID,
        });
      }

      const offerings = await Purchases.getOfferings();

      const availablePackages = offerings.current?.availablePackages || [];
      setPackages(availablePackages);
      Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
      setIsReady(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const purchasePackage = async (pack: PurchasesPackage) => {
    setIsLoading(true);
    try {
      const purchase = await Purchases.purchasePackage(pack);
      setError(null);
      return purchase.productIdentifier;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async () => {
    setIsLoading(true);
    try {
      const customer = await Purchases.restorePurchases();
      setError(null);
      return customer;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeRevenueCat();
  }, []);

  const value: RevenueCatContextType = {
    packages,
    isReady,
    error,
    initializeRevenueCat,
    purchasePackage,
    restorePurchases,
    isLoading,
  };

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};

export const useRevenueCat = () => {
  const context = useContext(RevenueCatContext);
  if (context === undefined) {
    throw new Error('useRevenueCat must be used within a RevenueCatProvider');
  }
  return context;
};
