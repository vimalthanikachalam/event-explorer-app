import AppLockGate from '@/components/AppLockGate';
import { Stack } from 'expo-router';
export default function AppLayout() {
  return (
    <AppLockGate>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
      </Stack>
    </AppLockGate>
  );
}
