import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'spellpals-client:';

export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

export async function saveJSON(key: string, value: unknown): Promise<void> {
  try { await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* ignore */ }
}

export async function clearAll(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  await AsyncStorage.multiRemove(keys.filter((k) => k.startsWith(PREFIX)));
}
