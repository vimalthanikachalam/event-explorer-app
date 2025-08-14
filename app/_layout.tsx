import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, I18nManager, View } from 'react-native';
import { Provider } from 'react-redux';
import { bootstrapAuth } from '../common/slices/authSlice';
import { bootstrapFavorites } from '../common/slices/favoritesSlice';
import { RootState, store, useAppDispatch, useAppSelector } from '../common/store';

function RootNavigator() {
  const segments = useSegments();
  const router = useRouter();
  const { user } = useAppSelector((s: RootState) => s.auth);
  const { rtl } = useAppSelector((s: RootState) => s.locale);
  const [ready, setReady] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(bootstrapAuth());
      await dispatch(bootstrapFavorites());
      setReady(true);
    })();
  }, [dispatch]);

  useEffect(() => {
    if (!ready) return;
    const inAuthGroup = segments[0] === '(auth)';
    const onSetupPin = inAuthGroup && segments[1] === 'setup-pin';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
      return;
    }

    if (user && inAuthGroup && !onSetupPin) {
      router.replace('/(app)');
    }
  }, [segments, user, ready, router]);

  useEffect(() => {
    // Apply RTL setting at runtime; full reload may be required to reflect completely.
    if (I18nManager.isRTL !== rtl) {
      I18nManager.allowRTL(rtl);
      I18nManager.forceRTL(rtl);
    }
  }, [rtl]);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
