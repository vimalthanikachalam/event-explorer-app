import { hasPin } from '@/common/storage/pin';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { clearError, signUp } from '../../common/slices/authSlice';
import { RootState, useAppDispatch, useAppSelector } from '../../common/store';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Screen from '../../components/ui/Screen';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { status, error } = useAppSelector((s: RootState) => s.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (error) Alert.alert('Error', error, [{ text: 'OK', onPress: () => dispatch(clearError()) }]);
  }, [dispatch, error]);

  const onSubmit = async () => {
    const res = await dispatch(signUp({ email, password, displayName: name }));
    if (res.type.endsWith('fulfilled')) {
      if (!(await hasPin())) {
        router.replace('/(auth)/setup-pin');
      } else {
        router.replace('/(app)');
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <Screen>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : 'height'} style={{ flex: 1, justifyContent: "center", padding: 16 }}>
            <View style={styles.header}>
              <Text style={styles.title}>Create account</Text>
              <Text style={styles.subtitle}>Join Event Explorer</Text>
            </View>
            <Input label="Name" value={name} onChangeText={setName} />
            <Input
              label="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <Input
              label="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Button
              title={status === "loading" ? "Creating..." : "Sign Up"}
              onPress={onSubmit}
              loading={status === "loading"}
            />
            <Link href="/(auth)/sign-in">
              <Text style={styles.linkCenter}>
                Already have an account? Sign in
              </Text>
            </Link>
          </KeyboardAvoidingView>
        </Screen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#475569', marginTop: 6 },
  linkCenter: { color: '#2563eb', textAlign: 'center', marginTop: 12, fontWeight: '600' },
});
