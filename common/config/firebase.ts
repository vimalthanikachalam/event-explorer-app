import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = (Constants.expoConfig?.extra as any)?.firebase || {};

if (!firebaseConfig.apiKey) {
  console.warn('Firebase config is missing.');
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = Platform.OS === 'web' ? getAuth(app) : initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
