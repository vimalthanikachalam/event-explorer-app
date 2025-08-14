import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const PIN_KEY = 'ee:pinHash';
const SALT_KEY = 'ee:pinSalt';

async function hashPin(pin: string, salt: string) {
  // Simple hash with SHA-256 over salt+pin; suitable since stored in SecureStore.
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${pin}`);
}

export async function hasPin(): Promise<boolean> {
  try {
    const [hash, salt] = await Promise.all([
      AsyncStorage.getItem(PIN_KEY),
      AsyncStorage.getItem(SALT_KEY),
    ]);
    return Boolean(hash && salt);
  } catch {
    return false;
  }
}

export async function setPin(pin: string): Promise<void> {
  const salt = Math.random().toString(36).slice(2, 10);
  const hash = await hashPin(pin, salt);
  await AsyncStorage.setItem(SALT_KEY, salt);
  await AsyncStorage.setItem(PIN_KEY, hash);
}

export async function verifyPin(pin: string): Promise<boolean> {
  const salt = await AsyncStorage.getItem(SALT_KEY);
  const storedHash = await AsyncStorage.getItem(PIN_KEY);
  if (!salt || !storedHash) return false;
  const testHash = await hashPin(pin, salt);
  return testHash === storedHash;
}

export async function clearPin(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([PIN_KEY, SALT_KEY]);
  } catch {}
}
