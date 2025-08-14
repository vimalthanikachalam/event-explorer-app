import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from '../slices/authSlice';
import eventsReducer from '../slices/eventsSlice';
import favoritesReducer from '../slices/favoritesSlice';
import localeReducer from '../slices/localeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  events: eventsReducer,
  favorites: favoritesReducer,
  locale: localeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
