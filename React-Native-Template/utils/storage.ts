import { MMKV } from 'react-native-mmkv';

// Storage instance for all data
export const storage = new MMKV();

// Storage keys as constants
export const STORAGE_KEYS = {
  DEVICE_ID: 'DEVICE_ID',
  THEME_MODE: 'THEME_MODE',
  LANGUAGE: 'LANGUAGE',
} as const;

// Helper functions for type-safe storage access
export function getString(key: keyof typeof STORAGE_KEYS): string | undefined {
  return storage.getString(key);
}

export function setString(key: keyof typeof STORAGE_KEYS, value: string): void {
  storage.set(key, value);
}

export function getBoolean(
  key: keyof typeof STORAGE_KEYS
): boolean | undefined {
  return storage.getBoolean(key);
}

export function setBoolean(
  key: keyof typeof STORAGE_KEYS,
  value: boolean
): void {
  storage.set(key, value);
}

export function getNumber(key: keyof typeof STORAGE_KEYS): number | undefined {
  return storage.getNumber(key);
}

export function setNumber(key: keyof typeof STORAGE_KEYS, value: number): void {
  storage.set(key, value);
}

export function removeItem(key: keyof typeof STORAGE_KEYS): void {
  storage.delete(key);
}

export function clearAll(): void {
  storage.clearAll();
}
