//* ------- Generate Types -------
export type GenerateProvider = 'replicate' | 'fal';

export interface GenerateOptions {
  provider: GenerateProvider;
}

export interface GenerateResult {
  imageUrl: string;
}

//* ------- useChat Types -------
export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  isLoading: boolean;
}

export interface UseChatOptions {
  endpoint: string;
  onError?: (error: any) => void;
  onMessageComplete?: () => void;
}

export interface SendMessageOptions {
  message: string;
  onProgress?: (text: string) => void;
}

//* ------- useIdentifier Types -------
export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

//* ------- Api Client Types -------
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiError {
  error: string;
  status: number;
  message: string;
}

export interface SecureHeaders extends Record<string, string> {
  'Content-Type': string;
  Authorization: string;
  'x-signature': string;
  'x-platform': 'ios' | 'android';
  'x-app-identifier': string;
  'x-user-id': string;
  'x-timestamp': string;
  'x-nonce': string;
  'x-device-id': string;
}
export interface RequestOptions<TBody> {
  endpoint: string;
  method: HttpMethod;
  body?: TBody;
  idToken?: string;
  requiresAuth?: boolean;
  requiresHmac?: boolean;
}
