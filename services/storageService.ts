import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageService = {
  async get<T>(key: string, fallback: T): Promise<T> {
    try {
      const val = await AsyncStorage.getItem(key);
      if (val === null) return fallback;
      return JSON.parse(val) as T;
    } catch { return fallback; }
  },
  async set(key: string, value: unknown): Promise<void> {
    try { await AsyncStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  async remove(key: string): Promise<void> {
    try { await AsyncStorage.removeItem(key); } catch {}
  },
  async clear(): Promise<void> {
    try { await AsyncStorage.clear(); } catch {}
  },
};
