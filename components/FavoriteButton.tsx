import { toggleFavorite } from '@/common/slices/favoritesSlice';
import { useAppDispatch, useAppSelector } from '@/common/store';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable } from 'react-native';

export default function FavoriteButton({ id, size = 24 }: { id: string; size?: number }) {
  const dispatch = useAppDispatch();
  const fav = useAppSelector((s) => s.favorites.ids.includes(id));
  return (
    <Pressable onPress={() => dispatch(toggleFavorite(id))} style={{ padding: 6 }}>
      <Ionicons name={fav ? 'heart' : 'heart-outline'} size={size} color={fav ? '#ef4444' : '#64748b'} />
    </Pressable>
  );
}
