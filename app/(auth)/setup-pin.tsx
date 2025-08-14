import { hasPin, setPin } from '@/common/storage/pin';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Screen from '@/components/ui/Screen';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

export default function SetupPin() {
  const [pin, setPinInput] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const onSave = async () => {
    try {
      if (pin.length !== 4 || confirm.length !== 4) {
        Alert.alert('Invalid PIN', 'Please enter a 4-digit PIN and confirm it.');
        return;
      }
      if (pin !== confirm) {
        Alert.alert('Mismatch', 'PIN and confirmation do not match.');
        return;
      }
      setBusy(true);
      await setPin(pin);
      const ok = await hasPin();
      if (ok) {
        router.replace('/(app)');
      } else {
        Alert.alert('Error', 'Failed to save PIN. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  };


  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Set your 4-digit PIN</Text>
        <Text style={styles.subtitle}>Used to unlock when biometrics are unavailable</Text>
      </View>
      <Input
        label="PIN"
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        value={pin}
        onChangeText={(t) => setPinInput(t.replace(/\D/g, '').slice(0, 4))}
      />
      <Input
        label="Confirm PIN"
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        value={confirm}
        onChangeText={(t) => setConfirm(t.replace(/\D/g, '').slice(0, 4))}
      />
      <Button title={busy ? 'Saving…' : 'Save PIN'} onPress={onSave} disabled={busy} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#475569', marginTop: 6, textAlign: 'center' },
});
