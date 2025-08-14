import { useFeaturedEvents, useSearchEvents } from '@/common/hooks/useEvents';
import i18n from '@/common/i18n';
import { fetchById } from '@/common/slices/eventsSlice';
import { useAppDispatch, useAppSelector } from '@/common/store';
import EventCard from '@/components/EventCard';
import FavoriteButton from '@/components/FavoriteButton';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Screen from '@/components/ui/Screen';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { I18nManager, SectionList, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const router = useRouter();
  const { featured } = useFeaturedEvents();
  const { items, loading, search } = useSearchEvents();
  const favIds = useAppSelector((s) => s.favorites.ids);
  const byId = useAppSelector((s) => s.events.byId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const missing = favIds.filter((id) => !byId[id]);
    missing.forEach((id) => dispatch(fetchById(id)));
  }, [favIds, byId, dispatch]);

  const favorites = useMemo(() => {
    return favIds.map((id) => byId[id]).filter(Boolean) as typeof featured;
  }, [favIds, byId]);

  const onSearch = () => search({ keyword: keyword.trim(), city: city.trim() });

  const go = (id: string) => (router as any).push({ pathname: '/events/[id]', params: { id } });

  return (
    <Screen contentStyle={{ padding: 0 }}>
      <SectionList
        style={{ padding: 20 }}
        sections={[
          ...(items.length
            ? [{ title: i18n.t('events'), data: items }]
            : []),
          ...(favorites.length
            ? [{ title: i18n.t('favorites'), data: favorites }]
            : []),
          ...(featured.length
            ? [{ title: i18n.t('featured'), data: featured }]
            : []),
        ]}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <Text style={styles.section}>{section.title}</Text>
        )}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => (
          <EventCard
            item={item}
            onPress={() => go(item.id)}
            right={<FavoriteButton id={item.id} />}
          />
        )}
        ListHeaderComponent={
          <View>
            <View style={{
              flexDirection: 'column'
            }}>
              <Input placeholder={i18n.t('search_placeholder')} value={keyword} onChangeText={setKeyword} style={{ flex: 1 }} />
              <Input placeholder={i18n.t('city_placeholder')} value={city} onChangeText={setCity} />
            </View>
            <Button title={i18n.t('search')} onPress={onSearch} loading={loading} />
            {favorites.length === 0 ? (
              <Text style={styles.muted}>{i18n.t('no_favorites')}</Text>
            ) : null}
          </View>
        }
        contentContainerStyle={{ paddingBottom: 60 }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row', alignItems: 'center', width: '100%' },
  section: { fontWeight: '700', fontSize: 18, color: '#0f172a', marginTop: 12, backgroundColor: '#fff' },
  muted: { color: '#64748b', marginTop: 8 },
});
