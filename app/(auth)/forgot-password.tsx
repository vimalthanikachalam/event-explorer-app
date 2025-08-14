import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Screen from '@/components/ui/Screen';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { clearError, forgotPassword } from '../../common/slices/authSlice';
import { RootState, useAppDispatch, useAppSelector } from '../../common/store';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const { status, error } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (error) Alert.alert('Error', error, [{ text: 'OK', onPress: () => dispatch(clearError()) }]);
    if (status === 'succeeded') Alert.alert('Sent', 'Password reset email sent. Check your inbox.');
  }, [dispatch, error, status]);

  const onSubmit = async () => {
    await dispatch(forgotPassword({ email }));
  };

  return (
    <Screen>
      <Text style={styles.title}>Reset your password</Text>
      <Input label="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <Button title={status === 'loading' ? 'Sending...' : 'Send reset email'} onPress={onSubmit} loading={status === 'loading'} />
      <Link href="/(auth)/sign-in"><Text style={styles.linkCenter}>Back to Sign in</Text></Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a', textAlign: 'center', marginBottom: 16 },
  linkCenter: { color: '#2563eb', textAlign: 'center', marginTop: 12, fontWeight: '600' },
});
