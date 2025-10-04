import { useState, useCallback } from 'react';
import * as Keychain from 'react-native-keychain';
import { fetch } from 'expo/fetch';
import CryptoJS from 'crypto-js';
import { ACCESSIBLE } from 'react-native-keychain';
import { Platform } from 'react-native';
import { getString, STORAGE_KEYS } from '@/utils/storage';
import * as Application from 'expo-application';
import { getApiUrl } from '@/helpers/app-functions';

type HmacState = {
  isLoading: boolean;
  error: string | null;
  checkHmacSecret: (userId: string) => Promise<void>;
  clearSecret: () => Promise<void>;
};

export const useHmac = (): HmacState => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;
  const deviceId = getString(STORAGE_KEYS.DEVICE_ID) ?? '';
  const platform = Platform.OS === 'ios' ? 'ios' : 'android';
  const appIdentifier = Application.applicationId ?? '';

  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const generateSignature = async (timestamp: string, nonce: string) => {
    const message = `${appIdentifier}${timestamp}${nonce}`;
    const signature = CryptoJS.HmacSHA256(message, apiKey).toString();
    return signature;
  };

  const decryptSecret = (secret: string) => {
    return CryptoJS.AES.decrypt(secret, apiKey).toString(CryptoJS.enc.Utf8);
  };

  const checkHmacSecret = useCallback(async (userId: string) => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        setIsLoading(false);
      } else {
        setIsLoading(true);
        await fetchAndStoreSecret(userId);
      }
    } catch {
      throw new Error('Failed to Authenticate');
    }
  }, []);

  const fetchAndStoreSecret = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Generate timestamp and nonce
      const timestamp = Date.now().toString();
      const nonce =
        Math.random().toString(36).substring(2) + Date.now().toString(36);

      // Generate signature with timestamp and nonce
      const signature = await generateSignature(timestamp, nonce);

      const baseUrl = getApiUrl();
      const response = await fetch(`${baseUrl}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-signature': signature,
          'x-timestamp': timestamp,
          'x-nonce': nonce,
          'x-app-identifier': appIdentifier,
          'x-device-id': deviceId,
          'x-platform': platform,
          'x-user-id': userId,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          throw new Error(errorData.error || 'Authentication failed');
        }
        throw new Error(errorData.error || 'Failed to Authenticate');
      }

      const data = await response.json();
      if (data.encryptedSecret) {
        const decryptedSecret = decryptSecret(data.encryptedSecret);
        await Keychain.setGenericPassword('HMAC_SECRET', decryptedSecret, {
          accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK,
        });
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error Authenticating:', err);
      setError(err instanceof Error ? err.message : 'Failed to Authenticate');
      throw err;
    }
  }, []);

  const clearSecret = useCallback(async () => {
    try {
      await Keychain.resetGenericPassword();
      setIsLoading(true);
    } catch {
      throw new Error('Failed to clear Authentication');
    }
  }, []);

  return {
    isLoading,
    error,
    checkHmacSecret,
    clearSecret,
  };
};
