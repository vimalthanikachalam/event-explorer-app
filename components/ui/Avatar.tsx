import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type AvatarProps = {
  size?: number;
  name?: string | null;
  email?: string | null;
  uri?: string | null;
  rounded?: number;
};

function getInitials(name?: string | null, email?: string | null) {
  const from = (name?.trim()) || (email?.trim()) || '';
  if (!from) return 'U';
  const parts = from.replace(/[_.-]/g, ' ').split(' ').filter(Boolean);
  const first = parts[0]?.[0];
  const second = parts.length > 1 ? parts[1]?.[0] : undefined;
  const initials = `${first || ''}${second || ''}`.toUpperCase();
  return initials || (from[0] || 'U').toUpperCase();
}

function stringToColor(str?: string | null) {
  const seed = (str || 'user').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const palette = [
    '#F59E0B',
    '#10B981',
    '#3B82F6',
    '#8B5CF6',
    '#EC4899',
    '#F43F5E',
    '#14B8A6',
    '#22C55E',
  ];
  return palette[seed % palette.length];
}

export default function Avatar({ size = 96, name, email, uri, rounded }: AvatarProps) {
  const initials = useMemo(() => getInitials(name, email), [name, email]);
  const bg = useMemo(() => stringToColor(name || email), [name, email]);
  const radius = rounded ?? size / 2;
  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: radius, backgroundColor: bg }]}>
      <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontWeight: '800',
  },
});
