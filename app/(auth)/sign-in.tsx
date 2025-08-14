import { storage, STORAGE_KEYS } from '@/common/storage/asyncStorage';
import { hasPin } from '@/common/storage/pin';
import { RootState, useAppDispatch, useAppSelector } from '@/common/store';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Screen from '@/components/ui/Screen';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { clearError, signIn } from '../../common/slices/authSlice';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { status, error } = useAppSelector((s: RootState) => s.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (error) Alert.alert('Error', error, [{ text: 'OK', onPress: () => dispatch(clearError()) }]);
  }, [dispatch, error]);

  const onSubmit = async () => {
    const res = await dispatch(signIn({ email, password }));
    if (res.type.endsWith('fulfilled')) {
      if (!(await hasPin())) {
        router.replace('/(auth)/setup-pin');
      } else {
        await storage.set(STORAGE_KEYS.skipLockOnceTs, Date.now());
        router.replace('/(app)');
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Screen>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, flexDirection: "column", justifyContent: "center", padding: 16 }}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>
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
            title={status === "loading" ? "Signing in..." : "Sign In"}
            onPress={onSubmit}
            loading={status === "loading"}
          />
          <View style={styles.row}>
            <Link href="/(auth)/forgot-password" asChild>
              <Pressable>
                <Text style={styles.link}>Forgot password?</Text>
              </Pressable>
            </Link>
            <Link href="/(auth)/sign-up" asChild>
              <Pressable>
                <Text style={styles.link}>Create account</Text>
              </Pressable>
            </Link>
          </View>
        </KeyboardAvoidingView>
      </Screen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", marginBottom: 16 },
  title: { fontSize: 28, fontWeight: "700", color: "#0f172a" },
  subtitle: { color: "#475569", marginTop: 6 },
  row: { marginTop: 12, flexDirection: "row", justifyContent: "space-between" },
  link: { color: "#2563eb", fontWeight: "600" },
});
