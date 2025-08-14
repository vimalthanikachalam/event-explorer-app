import { useBiometrics } from '@/common/hooks/useBiometrics';
import i18n from '@/common/i18n';
import { signOutUser } from '@/common/services/authService';
import { toggleLocale } from '@/common/slices/localeSlice';
import { useAppDispatch, useAppSelector } from '@/common/store';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Screen from '@/components/ui/Screen';
import React from 'react';
import { I18nManager, StyleSheet, Switch, Text, View } from 'react-native';
import { setUser } from '../../common/slices/authSlice';

export default function ProfileScreen() {
  const { supported, enabled, enable } = useBiometrics();
  const dispatch = useAppDispatch();
  const rtl = useAppSelector((s) => s.locale.rtl);
  const user = useAppSelector((s) => s.auth.user);

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
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerCard}>
          <Avatar size={96} name={user?.displayName} email={user?.email} uri={user?.photoURL} />
          <Text style={styles.nameText}>{user?.displayName || user?.email || 'Guest'}</Text>
          {!!user?.email && user?.displayName && <Text style={styles.subText}>{user.email}</Text>}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>{i18n.t('language')}</Text>
            <Button title={rtl ? i18n.t('english') : i18n.t('arabic')} onPress={onToggleLanguage} />
          </View>

          {supported && (
            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>{i18n.t('enable_biometrics')}</Text>
              <Switch value={enabled} onValueChange={enable} />
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Button title={i18n.t('sign_out')} onPress={onSignOut} variant="secondary" />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', gap: 20 },
  headerCard: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  nameText: { fontSize: 22, fontWeight: '700', color: '#0f172a', marginTop: 8, textAlign: 'center' },
  subText: { color: '#64748b' },
  section: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 16,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemLabel: { color: '#0f172a', fontWeight: '600', fontSize: 16 },
  footer: { marginTop: 12, alignItems: 'center' },
});
