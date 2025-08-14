import AsyncStorage from '@react-native-async-storage/async-storage';

const prefix = 'ee:';

export const storage = {
  async get(key: string) {
    try {
      const getStoredValue = await AsyncStorage.getItem(prefix + key);
      if (getStoredValue == null) return null;
      return JSON.parse(getStoredValue);
    } catch {
      return null;
    }
  },
  async set(key: string, value: any) {
    try {
      await AsyncStorage.setItem(prefix + key, JSON.stringify(value));
    } catch {}
  },
  async remove(key: string) {
    try {
      await AsyncStorage.removeItem(prefix + key);
    } catch {}
  },
  async merge(key: string, value: any) {
    try {
      const existing = (await storage.get(key)) || {};
      const merged = { ...existing, ...value };
      await storage.set(key, merged);
    } catch {}
  },
};

export const STORAGE_KEYS = {
  user: 'user',
  authToken: 'authToken',
  biometricEnabled: 'biometricEnabled',
  skipLockOnceTs: 'skipLockOnceTs',
} as const;
