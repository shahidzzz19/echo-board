import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UserPreferences {
  hashtag: string;
  categories: string[];
  language: string;
  darkMode: boolean;
  layout: 'grid' | 'list';
}

export interface UserState {
  // ✅ export this
  preferences: UserPreferences;
  favorites: string[];
  isAuthenticated: boolean;
  profile: { name: string; email: string; avatar: string } | null;
}

const initialState: UserState = {
  preferences: {
    categories: ['technology', 'sports'],
    language: 'en',
    darkMode: false,
    layout: 'grid',
    hashtag: '',
  },
  favorites: [],
  isAuthenticated: false,
  profile: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const idx = state.favorites.indexOf(action.payload);
      idx > -1 ? state.favorites.splice(idx, 1) : state.favorites.push(action.payload);
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setProfile: (state, action: PayloadAction<UserState['profile']>) => {
      state.profile = action.payload;
    },
  },
});

export const { updatePreferences, toggleFavorite, setAuthenticated, setProfile } =
  userSlice.actions;
export default userSlice.reducer;
