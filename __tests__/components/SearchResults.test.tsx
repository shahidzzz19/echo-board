import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import type React from 'react';
import { Provider } from 'react-redux';
import { SearchResults } from '@/components/search-results';
import { contentApi } from '@/lib/api/contentApi';
import searchSlice from '@/lib/slices/searchSlice';
import userSlice from '@/lib/slices/userSlice';

const mockStore = configureStore({
  reducer: {
    search: searchSlice,
    user: userSlice,
    [contentApi.reducerPath]: contentApi.reducer,
  },
  preloadedState: {
    search: {
      query: '',
      results: [],
      loading: false,
      error: null,
      filters: {
        type: [],
        category: [],
        dateRange: 'all',
      },
    },
    user: {
      preferences: {
        categories: ['technology'],
        language: 'en',
        darkMode: false,
        layout: 'grid',
      },
      favorites: [],
      isAuthenticated: false,
      profile: null,
    },
  },
});

const renderWithProvider = (component: React.ReactElement) => {
  return render(<Provider store={mockStore}>{component}</Provider>);
};

describe('SearchResults', () => {
  it('shows empty state when no query is provided', () => {
    renderWithProvider(<SearchResults />);

    expect(screen.getByText('Start typing to search for content')).toBeInTheDocument();
  });

  it('displays search query in heading when searching', () => {
    const storeWithQuery = configureStore({
      reducer: {
        search: searchSlice,
        user: userSlice,
        [contentApi.reducerPath]: contentApi.reducer,
      },
      preloadedState: {
        search: {
          query: 'test query',
          results: [],
          loading: true,
          error: null,
          filters: {
            type: [],
            category: [],
            dateRange: 'all',
          },
        },
        user: {
          preferences: {
            categories: ['technology'],
            language: 'en',
            darkMode: false,
            layout: 'grid',
          },
          favorites: [],
          isAuthenticated: false,
          profile: null,
        },
      },
    });

    render(
      <Provider store={storeWithQuery}>
        <SearchResults />
      </Provider>,
    );

    expect(screen.getByText('Searching for "test query"')).toBeInTheDocument();
  });
});
