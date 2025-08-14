import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'favorites:v1';

export async function getFavoriteIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const ids = JSON.parse(raw);
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

export async function setFavoriteIds(ids: string[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(ids));
}
