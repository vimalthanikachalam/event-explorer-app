import { useSearchEvents } from '@/common/hooks/useEvents';
import i18n from '@/common/i18n';
import EventCard from '@/components/EventCard';
import FavoriteButton from '@/components/FavoriteButton';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Screen from '@/components/ui/Screen';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EventsScreen() {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const { items, loading, search } = useSearchEvents();
  const router = useRouter();

  const onSearch = () => search({ keyword: keyword.trim(), city: city.trim() });
  const go = (id: string) => (router as any).push({ pathname: '/events/[id]', params: { id } });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Screen>
        <Input
          placeholder={i18n.t("search_placeholder")}
          value={keyword}
          onChangeText={setKeyword}
        />
        <Input
          placeholder={i18n.t("city_placeholder")}
          value={city}
          onChangeText={setCity}
        />
        <Button title={i18n.t("search")} onPress={onSearch} loading={loading} />
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={({ item }) => (
            <EventCard
              item={item}
              onPress={() => go(item.id)}
              right={<FavoriteButton id={item.id} />}
            />
          )}
          ListEmptyComponent={
            <Text style={{ color: "#64748b" }}>No events</Text>
          }
        />
      </Screen>
    </SafeAreaView>
  );
}
