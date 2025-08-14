import Constants from 'expo-constants';
import { EventItem, EventSearchParams } from '../models/event';

const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

const API_KEY = (Constants.expoConfig?.extra as any)?.EXPO_PUBLIC_TICKETMASTER_API_KEY || ''

function tmToEvent(item: any): EventItem {
  const image = item?.images?.[0]?.url;
  const venue = item?._embedded?.venues?.[0];
  return {
    id: item.id,
    name: item.name,
    url: item.url,
    image,
    date: item?.dates?.start?.dateTime || item?.dates?.start?.localDate,
    venue: venue?.name,
    city: venue?.city?.name,
    country: venue?.country?.name,
    latitude: venue?.location ? Number(venue.location.latitude) : undefined,
    longitude: venue?.location ? Number(venue.location.longitude) : undefined,
  };
}

export async function searchEvents(params: EventSearchParams): Promise<EventItem[]> {
  const search = new URLSearchParams();
  if (params.keyword) search.set('keyword', params.keyword);
  if (params.city) search.set('city', params.city);
  if (params.page) search.set('page', String(params.page));
  search.set('size', String(params.size ?? 20));
  search.set('apikey', API_KEY);
  const url = `${BASE_URL}/events.json?${search.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);
  const data = await res.json();
  const items = data?._embedded?.events ?? [];
  return items.map(tmToEvent);
}

export async function getEventById(id: string): Promise<EventItem | null> {
  const url = `${BASE_URL}/events/${id}.json?apikey=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return tmToEvent(data);
}

export async function getFeaturedEvents(): Promise<EventItem[]> {
  // Simple placeholder: fetch first page without filters
  return searchEvents({ size: 10 });
}
