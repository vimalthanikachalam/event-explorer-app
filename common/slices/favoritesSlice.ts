import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFavoriteIds, setFavoriteIds } from '../storage/favorites';

export type FavoritesState = {
  ids: string[];
  loading: boolean;
};

const initialState: FavoritesState = {
  ids: [],
  loading: false,
};

export const bootstrapFavorites = createAsyncThunk('favorites/bootstrap', async () => {
  const ids = await getFavoriteIds();
  return ids;
});

export const toggleFavorite = createAsyncThunk('favorites/toggle', async (id: string, { getState }) => {
  const state = getState() as any;
  const ids: string[] = state.favorites.ids;
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  await setFavoriteIds(next);
  return next;
});

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapFavorites.pending, (s) => {
        s.loading = true;
      })
      .addCase(bootstrapFavorites.fulfilled, (s, a: PayloadAction<string[]>) => {
        s.loading = false;
        s.ids = a.payload;
      })
      .addCase(bootstrapFavorites.rejected, (s) => {
        s.loading = false;
      })
      .addCase(toggleFavorite.fulfilled, (s, a: PayloadAction<string[]>) => {
        s.ids = a.payload;
      });
  },
});

export default favoritesSlice.reducer;
