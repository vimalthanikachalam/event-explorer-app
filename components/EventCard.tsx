import { EventItem } from '@/common/models/event';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function EventCard({ item, onPress, right }: { item: EventItem; onPress?: () => void; right?: React.ReactNode }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : <View style={[styles.image, styles.placeholder]} />}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.meta} numberOfLines={1}>
          {item.venue || item.city || ''}
        </Text>
        {item.date ? (
          <Text style={styles.date}>
            {new Intl.DateTimeFormat(undefined, {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }).format(new Date(item.date))}
          </Text>
        ) : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
    alignItems: 'center',
  },
  image: { width: 84, height: 84, backgroundColor: '#f1f5f9' },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, padding: 10 },
  title: { fontWeight: '700', fontSize: 14, color: '#0f172a' },
  meta: { color: '#475569', marginTop: 2, fontSize: 12 },
  date: { color: '#334155', marginTop: 6, fontSize: 12 },
  right: { paddingHorizontal: 8 },
});
