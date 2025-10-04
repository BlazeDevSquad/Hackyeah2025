import React, { createContext, useContext, useEffect } from 'react';
import { Platform } from 'react-native';

import Purchases, {
  PurchasesPackage,
  CustomerInfo,
} from 'react-native-purchases';
import { useQuery, useMutation } from '@tanstack/react-query';

import { useAuth } from './FirebaseProvider.with-react-query';

const APIKeys = {
  apple: process.env.EXPO_PUBLIC_RC_APPLE_KEY as string,
  google: process.env.EXPO_PUBLIC_RC_GOOGLE_KEY as string,
};

// --- React Query Functions ---

// This function will be used by useQuery to fetch packages.
const fetchPackages = async () => {
  const offerings = await Purchases.getOfferings();
  return offerings.current?.availablePackages || [];
};

// These functions will be used by useMutation.
const purchasePackageAction = (pack: PurchasesPackage) => {
  return Purchases.purchasePackage(pack);
};

const restorePurchasesAction = () => {
  return Purchases.restorePurchases();
};

// --- Context Definition ---

interface RevenueCatContextType {
  packages: PurchasesPackage[];
  isPackagesLoading: boolean;
  packagesError: Error | null;
  purchasePackage: (
    pack: PurchasesPackage
  ) => Promise<unknown>;
  isPurchasing: boolean;
  purchaseError: Error | null;
  restorePurchases: () => Promise<CustomerInfo>;
  isRestoring: boolean;
  restoreError: Error | null;
}

const RevenueCatContext = createContext<RevenueCatContextType | undefined>(
  undefined
);

export const RevenueCatProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { user, refreshIdToken } = useAuth();

  // Effect to configure Purchases once when the provider mounts.
  useEffect(() => {
    if (Platform.OS === 'android') {
      Purchases.configure({ apiKey: APIKeys.google });
    } else {
      Purchases.configure({ apiKey: APIKeys.apple });
    }
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
  }, []);

  // Effect to log the user in or out of RevenueCat when auth state changes.
  useEffect(() => {
    const setupRevenueCatUser = async () => {
      if (user) {
        try {
          await Purchases.logIn(user.uid);
        } catch (error) {
          console.error('RevenueCat logIn error:', error);
        }
      } else {
        try {
          await Purchases.logOut();
        } catch (error) {
          console.error('RevenueCat logOut error:', error);
        }
      }
    };
    setupRevenueCatUser();
  }, [user]);

  // useQuery to fetch subscription packages.
  // It automatically handles loading, error, and caching.
  const {
    data: packages,
    isLoading: isPackagesLoading,
    error: packagesError,
  } = useQuery<PurchasesPackage[], Error>({
    queryKey: ['revenueCatPackages'], // Unique key for this query
    queryFn: fetchPackages,
  });

  // useMutation for handling the purchase of a package.
  const {
    mutateAsync: purchasePackage,
    isLoading: isPurchasing,
    error: purchaseError,
  } = useMutation<unknown, Error, PurchasesPackage>({
    mutationFn: purchasePackageAction,
    onSuccess: async () => {
      // After a successful purchase, refresh the Firebase ID token
      // to get the latest custom claims with the new entitlement.
      await refreshIdToken();
    },
  });

  // useMutation for handling restoring purchases.
  const {
    mutateAsync: restorePurchases,
    isLoading: isRestoring,
    error: restoreError,
  } = useMutation<CustomerInfo, Error>({
    mutationFn: restorePurchasesAction,
  });

  const value: RevenueCatContextType = {
    packages: packages || [],
    isPackagesLoading,
    packagesError,
    purchasePackage,
    isPurchasing,
    purchaseError,
    restorePurchases,
    isRestoring,
    restoreError,
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
