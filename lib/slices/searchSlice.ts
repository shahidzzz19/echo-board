import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ContentItem } from './contentSlice';

interface SearchState {
  query: string;
  results: ContentItem[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  query: '',
  results: [],
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setResults(state, action: PayloadAction<ContentItem[]>) {
      state.results = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
  },
});

// ✅ Export only the actions individually
export const { setResults, setLoading, setError, setQuery } = searchSlice.actions;

// ✅ Default export reducer
export default searchSlice.reducer;