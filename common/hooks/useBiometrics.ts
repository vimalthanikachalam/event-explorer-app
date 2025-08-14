import { storage, STORAGE_KEYS } from '@/common/storage/asyncStorage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

export function useBiometrics() {
  const [supported, setSupported] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const [types, enrolled] = await Promise.all([
        LocalAuthentication.supportedAuthenticationTypesAsync(),
        LocalAuthentication.isEnrolledAsync(),
      ]);
      const biometricSupported = Array.isArray(types) && types.length > 0;
      setSupported(biometricSupported && enrolled);
      const saved = await storage.get(STORAGE_KEYS.biometricEnabled);
      setEnabled(Boolean(saved));
      setReady(true);
    })();
  }, []);

  const enable = useCallback(async (value: boolean) => {
    setEnabled(value);
    await storage.set(STORAGE_KEYS.biometricEnabled, value);
  }, []);

  const authenticate = useCallback(async (reason = 'Authenticate') => {
    if (!supported) return { success: false } as LocalAuthentication.LocalAuthenticationResult;
    const res = await LocalAuthentication.authenticateAsync({
      promptMessage: reason,
      fallbackLabel: Platform.OS === 'ios' ? undefined : 'Use device credentials',
      disableDeviceFallback: Platform.OS === 'ios',
    });
    return res;
  }, [supported]);

  return { supported, enabled, enable, authenticate, ready };
}
