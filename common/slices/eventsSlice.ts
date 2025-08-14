import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventItem, EventSearchParams } from '../models/event';
import { getEventById, getFeaturedEvents, searchEvents } from '../services/eventsService';

export type EventsState = {
  items: EventItem[];
  featured: EventItem[];
  loading: boolean;
  error?: string | null;
  byId: Record<string, EventItem | undefined>;
};

const initialState: EventsState = {
  items: [],
  featured: [],
  loading: false,
  error: null,
  byId: {},
};

export const fetchFeatured = createAsyncThunk('events/featured', async () => {
  const res = await getFeaturedEvents();
  return res;
});

export const fetchSearch = createAsyncThunk('events/search', async (params: EventSearchParams) => {
  const res = await searchEvents(params);
  return res;
});

export const fetchById = createAsyncThunk('events/byId', async (id: string) => {
  const res = await getEventById(id);
  return res;
});

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearSearch(state) {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatured.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchFeatured.fulfilled, (s, a: PayloadAction<EventItem[]>) => {
        s.loading = false;
        s.featured = a.payload;
        for (const it of a.payload) s.byId[it.id] = it;
      })
      .addCase(fetchFeatured.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || 'Failed';
      })
      .addCase(fetchSearch.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchSearch.fulfilled, (s, a: PayloadAction<EventItem[]>) => {
        s.loading = false;
        s.items = a.payload;
        for (const it of a.payload) s.byId[it.id] = it;
      })
      .addCase(fetchSearch.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || 'Failed';
      })
      .addCase(fetchById.fulfilled, (s, a: PayloadAction<EventItem | null>) => {
        if (a.payload) s.byId[a.payload.id] = a.payload;
      });
  },
});

export const { clearSearch } = eventsSlice.actions;
export default eventsSlice.reducer;
