import { useBiometrics } from '@/common/hooks/useBiometrics';
import { signOutUser } from '@/common/services/authService';
import { useAppDispatch } from '@/common/store';
import Button from '@/components/ui/Button';
import Screen from '@/components/ui/Screen';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { setUser } from '../../common/slices/authSlice';

export default function AppHome() {
  const { supported, enabled, enable } = useBiometrics();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onSignOut = async () => {
    await signOutUser();
    dispatch(setUser(null));
    router.replace('/(auth)/sign-in');
  };
  return (
    <Screen>
      <View style={styles.box}>
        <Text style={styles.title}>You are signed in 🎉</Text>
        <Text style={styles.subtitle}>Start exploring events</Text>
        {supported && (
          <View style={styles.row}>
            <Text style={styles.label}>Enable Biometric Login</Text>
            <Switch value={enabled} onValueChange={enable} />
          </View>
        )}
        <Button title="Sign out" onPress={onSignOut} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#475569', marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 12 },
  label: { color: '#0f172a', fontWeight: '600' },
});
