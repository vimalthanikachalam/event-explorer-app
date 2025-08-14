import i18n from '@/common/i18n';
import { useAppSelector } from '@/common/store';
import AppLockGate from '@/components/AppLockGate';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function AppLayout() {
  const locale = useAppSelector((s) => s.locale.locale);
  return (
    <AppLockGate>
      <Tabs key={locale} screenOptions={{ headerShown: true }}>
        <Tabs.Screen
          name="index"
          options={{
            title: i18n.t('home'),
            tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: i18n.t('profile'),
            tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
          }}
        />
      </Tabs>
    </AppLockGate>
  );
}
