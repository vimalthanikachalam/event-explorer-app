import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import i18n, { Locale } from '../i18n';

export type LocaleState = {
  locale: Locale;
  rtl: boolean;
};

const initialState: LocaleState = {
  locale: (i18n.locale as Locale) ?? 'en',
  rtl: i18n.locale === 'ar',
};

const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocale(state, action: PayloadAction<Locale>) {
      i18n.locale = action.payload;
      state.locale = action.payload;
      state.rtl = action.payload === 'ar';
    },
    toggleLocale(state) {
      const next: Locale = state.locale === 'en' ? 'ar' : 'en';
      i18n.locale = next;
      state.locale = next;
      state.rtl = next === 'ar';
    },
  },
});

export const { setLocale, toggleLocale } = localeSlice.actions;
export default localeSlice.reducer;
