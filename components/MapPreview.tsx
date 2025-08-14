import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  latitude: number;
  longitude: number;
  label?: string;
  onOpenExternal?: () => void;
};

export default function MapPreview({ label, onOpenExternal }: Props) {
  return (
    <Pressable onPress={onOpenExternal} style={styles.fallback}>
      <Text style={styles.fallbackText}>{label || 'Open in Maps'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fallback: {
    height: 160,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  fallbackText: { color: '#334155', fontWeight: '600' },
});
