import { useBiometrics } from '@/common/hooks/useBiometrics';
import i18n from '@/common/i18n';
import { signOutUser } from '@/common/services/authService';
import { toggleLocale } from '@/common/slices/localeSlice';
import { useAppDispatch, useAppSelector } from '@/common/store';
import Button from '@/components/ui/Button';
import Screen from '@/components/ui/Screen';
import React from 'react';
import { I18nManager, StyleSheet, Switch, Text, View } from 'react-native';
import { setUser } from '../../common/slices/authSlice';

export default function ProfileScreen() {
  const { supported, enabled, enable } = useBiometrics();
  const dispatch = useAppDispatch();
  const rtl = useAppSelector((s) => s.locale.rtl);

  const onToggleLanguage = () => {
    dispatch(toggleLocale());
    I18nManager.allowRTL(!I18nManager.isRTL);
    I18nManager.forceRTL(!I18nManager.isRTL);
  };

  const onSignOut = async () => {
    await signOutUser();
    dispatch(setUser(null));
  };

  return (
    <Screen>
      <View style={styles.box}>
        <Text style={styles.title}>{i18n.t('profile')}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('language')}</Text>
          <Button title={rtl ? i18n.t('english') : i18n.t('arabic')} onPress={onToggleLanguage} />
        </View>

        {supported && (
          <View style={styles.row}>
            <Text style={styles.label}>{i18n.t('enable_biometrics')}</Text>
            <Switch value={enabled} onValueChange={enable} />
          </View>
        )}

        <Button title={i18n.t('sign_out')} onPress={onSignOut} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#0f172a' },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 12 },
  label: { color: '#0f172a', fontWeight: '600' },
});
