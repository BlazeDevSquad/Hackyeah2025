import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';
import { setString, removeItem, STORAGE_KEYS } from '@/utils/storage';

export type ThemeMode = 'light' | 'dark' | 'system';
export type Mode = 'light' | 'dark';

interface ThemeState {
  selectedMode: ThemeMode;
  mode: Mode;
}

const initialState: ThemeState = {
  selectedMode: 'system',
  mode: 'light',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.selectedMode = action.payload;
      if (action.payload === 'system') {
        state.mode = Appearance.getColorScheme() || 'light';
        removeItem(STORAGE_KEYS.THEME_MODE);
      } else {
        state.mode = action.payload;
        setString(STORAGE_KEYS.THEME_MODE, action.payload);
      }
    },
    updateEffectiveTheme: (state) => {
      if (state.selectedMode === 'system') {
        state.mode = Appearance.getColorScheme() || 'light';
      }
    },
  },
});

export const { setThemeMode, updateEffectiveTheme } = themeSlice.actions;

export default themeSlice.reducer;
