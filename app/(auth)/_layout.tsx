import { Stack } from 'expo-router';
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" options={{ title: 'Sign In' }}/>
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="setup-pin" />
      <Stack.Screen name="forgot-password" options={{ title: 'Forgot password', headerShown: true }} />
    </Stack>
  );
}
