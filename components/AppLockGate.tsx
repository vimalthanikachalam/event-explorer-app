import { useBiometrics } from '@/common/hooks/useBiometrics';
import { storage, STORAGE_KEYS } from '@/common/storage/asyncStorage';
import { hasPin, verifyPin } from '@/common/storage/pin';
import Input from '@/components/ui/Input';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, AppStateStatus, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import Button from './ui/Button';

type Props = { children: React.ReactNode };

export default function AppLockGate({ children }: Props) {
  const { supported, enabled, authenticate, ready: bioReady } = useBiometrics();
  const shouldLock = supported && enabled;

  const [unlocked, setUnlocked] = useState<boolean>(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pinMode, setPinMode] = useState<boolean>(false);
  const [pin, setPin] = useState('');

  const appState = useRef<AppStateStatus>(AppState.currentState);
  const hasMounted = useRef(false);
  const prevShouldLock = useRef<boolean>(shouldLock);
  const justUnlockedAt = useRef<number>(0);
  const backgroundedAt = useRef<number | null>(null);

  // Decide initial lock state
  useEffect(() => {
    if (!bioReady) return;

    const init = async () => {
      // One-time skip after sign-in (when PIN existed)
  const skipTs = await storage.get(STORAGE_KEYS.skipLockOnceTs);
      if (!hasMounted.current) {
        hasMounted.current = true;
        if (skipTs) {
          await storage.remove(STORAGE_KEYS.skipLockOnceTs);
          setUnlocked(true);
          prevShouldLock.current = shouldLock;
          return;
        }
        const pinExists = await hasPin();
        if (shouldLock) {
          setUnlocked(false);
          setPinMode(false);
        } else if (pinExists) {
          setUnlocked(false);
          setPinMode(true);
        } else {
          setUnlocked(true);
        }
        prevShouldLock.current = shouldLock;
        return;
      }

      // If biometrics get enabled while active, don't force-lock immediately; wait for next resume
      if (!prevShouldLock.current && shouldLock && appState.current === 'active') {
        setUnlocked(true);
      } else if (!shouldLock) {
        setUnlocked(true);
      }
      prevShouldLock.current = shouldLock;
    };

    init();
  }, [shouldLock, bioReady]);

  // Background/foreground handling with 15s threshold
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      const prev = appState.current;
      appState.current = next;

      if (prev === 'active' && next.match(/inactive|background/)) {
        backgroundedAt.current = Date.now();
      }

      if (prev.match(/inactive|background/) && next === 'active') {
        (async () => {
          // Skip lock if resumed within 15 seconds
          if (backgroundedAt.current && Date.now() - backgroundedAt.current < 30000) {
            backgroundedAt.current = null;
            return;
          }
          backgroundedAt.current = null;
          // Avoid re-locking immediately after a successful unlock
          if (Date.now() - justUnlockedAt.current < 800) return;

          const pinExists = await hasPin();
          if (shouldLock) {
            setUnlocked(false);
            setError(null);
            setPinMode(false);
          } else if (pinExists) {
            setUnlocked(false);
            setPinMode(true);
            setError(null);
          }
        })();
      }
    });
    return () => sub.remove();
  }, [shouldLock]);

  const onUnlock = useCallback(async () => {
    try {
      setBusy(true);
      setError(null);
      const res = await authenticate('Unlock to continue');
      if (res.success) {
        setUnlocked(true);
        justUnlockedAt.current = Date.now();
      } else if ((res as any).error) {
        const code = String((res as any).error);
        if (code === 'missing_usage_description') {
          if (await hasPin()) setPinMode(true);
        } else {
          setError(code);
        }
      } else {
        setError('Authentication failed');
      }
    } catch (e: any) {
      setError(e?.message || 'Authentication error');
    } finally {
      setBusy(false);
    }
  }, [authenticate]);

  const onUnlockWithPin = useCallback(async () => {
    try {
      setBusy(true);
      setError(null);
      if (pin.length !== 4) {
        setError('Enter 4-digit PIN');
        return;
      }
      const ok = await verifyPin(pin);
      if (ok) {
        setUnlocked(true);
        setPin('');
        justUnlockedAt.current = Date.now();
      } else {
        setError('Incorrect PIN');
      }
    } finally {
      setBusy(false);
    }
  }, [pin]);

  if (!bioReady) {
    return (
      <View style={styles.overlay}>
        <ActivityIndicator />
      </View>
    );
  }

  if (unlocked) return <>{children}</>;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>App Locked</Text>
        {!pinMode ? (
          <>
            <Text style={styles.subtitle}>Use biometrics to unlock</Text>
            <View style={{ height: 12 }} />
            <Button title={busy ? 'Unlocking…' : 'Unlock with Biometrics'} onPress={onUnlock} disabled={busy} />
            <View style={{ height: 12 }} />
            <Button
              title="Use PIN instead"
              variant="secondary"
              onPress={async () => {
                setPinMode(await hasPin());
                setError(null);
              }}
            />
          </>
        ) : (
          <>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <Text style={styles.subtitle}>Enter your 4-digit PIN</Text>
              <Input
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                value={pin}
                autoFocus
                onChangeText={(t) => setPin(t.replace(/\D/g, '').slice(0, 4))}
                style={{ textAlign: 'center', letterSpacing: 6, minWidth: 100 }}
              />
              <Button title={busy ? 'Unlocking…' : 'Unlock with PIN'} onPress={onUnlockWithPin} disabled={busy} />
            </KeyboardAvoidingView>
          </>
        )}
        {busy && (
          <View style={{ marginTop: 12 }}>
            <ActivityIndicator />
          </View>
        )}
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 9999,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  subtitle: { marginTop: 6, color: '#475569' },
  error: { marginTop: 10, color: '#ef4444' },
});
