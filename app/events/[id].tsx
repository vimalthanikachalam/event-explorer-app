import { useEvent } from '@/common/hooks/useEvents';
import i18n from '@/common/i18n';
import FavoriteButton from '@/components/FavoriteButton';
import MapPreview from '@/components/MapPreview';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = useEvent(id);

  if (!item) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  const openMap = () => {
    if (!item.latitude || !item.longitude) return;
    const lat = item.latitude;
    const lng = item.longitude;
    const label = encodeURIComponent(item.venue || item.name);
    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${lat},${lng}&q=${label}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{item.name}</Text>
      <View style={styles.row}>
        <Text style={styles.meta}>{item.venue || item.city}</Text>
        <FavoriteButton id={item.id} />
      </View>
      {item.date ? <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text> : null}

      {item.latitude && item.longitude ? (
        <MapPreview latitude={item.latitude} longitude={item.longitude} label={item.venue || item.name} onOpenExternal={openMap} />
      ) : null}

      {item.url ? (
        <Pressable onPress={() => Linking.openURL(item.url!)}>
          <Text style={styles.link}>{i18n.t('details')}: {item.url}</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontWeight: '800', fontSize: 22, color: '#0f172a' },
  row: { marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  meta: { color: '#475569' },
  date: { marginTop: 8, color: '#0f172a' },
  link: { color: '#2563eb', marginTop: 16 },
});
