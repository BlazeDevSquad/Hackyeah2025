import CryptoJS from 'crypto-js';
import { Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { SecureHeaders, ApiError, RequestOptions } from '@/utils/types';
import * as Application from 'expo-application';
import { getDeviceId, getApiUrl } from '@/helpers/app-functions';

export async function createSecureHeaders(
  userId: string,
  idToken: string | null,
  body: Record<string, unknown> = {}
): Promise<SecureHeaders> {
  const timestamp = Date.now().toString();
  const nonce =
    Math.random().toString(36).substring(2) + Date.now().toString(36);
  const bodyString = JSON.stringify(body);
  const message = `${timestamp}${nonce}${bodyString}`;
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;
  const hmacSecret = await Keychain.getGenericPassword();
  const deviceId = await getDeviceId();

  if (!apiKey) {
    throw new Error('API key not configured');
  }

  if (!hmacSecret) {
    throw new Error('HMAC secret not found');
  }

  const signature = CryptoJS.HmacSHA256(
    message,
    hmacSecret.password
  ).toString();

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${idToken}`,
    'x-signature': signature,
    'x-timestamp': timestamp,
    'x-nonce': nonce,
    'x-app-identifier': Application.applicationId ?? '',
    'x-device-id': deviceId,
    'x-platform': Platform.OS === 'ios' ? 'ios' : 'android',
    'x-app-version': Application.nativeApplicationVersion ?? '',
    'x-user-id': userId,
  };
}

class ApiClient {
  private baseURL: string;
  private userId: string;

  constructor(baseURL: string, userId: string) {
    this.baseURL = getApiUrl() || baseURL;
    this.userId = userId;
  }

  async request<TResponse, TBody extends Record<string, unknown>>(
    options: RequestOptions<TBody>
  ): Promise<TResponse> {
    if (options.requiresAuth && !this.userId) {
      throw new Error('Authentication required for this request');
    }

    const hmacSecret = await Keychain.getGenericPassword();
    if (options.requiresHmac && !hmacSecret) {
      throw new Error('HMAC secret not set');
    }

    const headers = await createSecureHeaders(
      this.userId,
      options.idToken ?? '',
      options.body || {}
    );

    const response = await fetch(`${this.baseURL}${options.endpoint}`, {
      method: options.method,
      headers: headers as HeadersInit,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as ApiError;
      if (response.status === 401) {
        if (
          error.message?.includes('auth/id-token-expired') ||
          error.error?.includes('auth/id-token-expired')
        ) {
          throw new Error('AUTH_TOKEN_EXPIRED');
        }
        throw new Error('Authentication failed');
      }
      throw new Error(error.message || error.error || 'Request failed');
    }

    return data as TResponse;
  }

  async get<TResponse>(
    endpoint: string,
    requiresAuth = true,
    requiresHmac = true
  ): Promise<TResponse> {
    return this.request<TResponse, never>({
      endpoint,
      method: 'GET',
      requiresAuth,
      requiresHmac,
    });
  }

  async post<TResponse, TBody extends Record<string, unknown>>(
    endpoint: string,
    body: TBody,
    requiresAuth = true,
    requiresHmac = true
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>({
      endpoint,
      method: 'POST',
      body,
      requiresAuth,
      requiresHmac,
    });
  }

  async put<TResponse, TBody extends Record<string, unknown>>(
    endpoint: string,
    body: TBody,
    requiresAuth = true,
    requiresHmac = true
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>({
      endpoint,
      method: 'PUT',
      body,
      requiresAuth,
      requiresHmac,
    });
  }

  async delete<TResponse>(
    endpoint: string,
    requiresAuth = true,
    requiresHmac = true
  ): Promise<TResponse> {
    return this.request<TResponse, never>({
      endpoint,
      method: 'DELETE',
      requiresAuth,
      requiresHmac,
    });
  }
}

export default ApiClient;
