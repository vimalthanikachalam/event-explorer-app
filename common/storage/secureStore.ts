import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

async function isAvailable() {
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function saveSecure(key: string, value: string) {
  try {
    if (await isAvailable()) {
      await SecureStore.setItemAsync(key, value, { keychainService: 'event-explorer' });
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } catch {}
}

export async function getSecure(key: string) {
  try {
    if (await isAvailable()) {
      return await SecureStore.getItemAsync(key, { keychainService: 'event-explorer' });
    }
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function deleteSecure(key: string) {
  try {
    if (await isAvailable()) {
      await SecureStore.deleteItemAsync(key, { keychainService: 'event-explorer' });
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch {}
}
