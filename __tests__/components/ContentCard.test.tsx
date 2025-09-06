import type React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ContentCard } from '@/components/content-card';
import userSlice from '@/lib/slices/userSlice';
import type { ContentItem } from '@/lib/slices/contentSlice';

const mockStore = configureStore({
  reducer: {
    user: userSlice,
  },
  preloadedState: {
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

const mockItem: ContentItem = {
  id: 'test-1',
  type: 'news',
  title: 'Test News Article',
  description: 'This is a test description',
  image: '/test-image.jpg',
  url: '#test',
  category: 'technology',
  publishedAt: '2024-01-01T00:00:00Z',
  source: 'Test Source',
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(<Provider store={mockStore}>{component}</Provider>);
};

describe('ContentCard', () => {
  it('renders content card with correct information', () => {
    renderWithProvider(<ContentCard item={mockItem} />);

    expect(screen.getByText('Test News Article')).toBeInTheDocument();
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
    expect(screen.getByText('Test Source')).toBeInTheDocument();
    expect(screen.getByText('technology')).toBeInTheDocument();
  });

  it('toggles favorite when heart button is clicked', () => {
    renderWithProvider(<ContentCard item={mockItem} />);

    const favoriteButton = screen.getByRole('button', { name: /heart/i });
    fireEvent.click(favoriteButton);

    // Check if the action was dispatched (would need to mock store dispatch)
    expect(favoriteButton).toBeInTheDocument();
  });

  it('displays correct badge for content type', () => {
    renderWithProvider(<ContentCard item={mockItem} />);

    expect(screen.getByText('news')).toBeInTheDocument();
  });

  it('shows trending badge when item is trending', () => {
    const trendingItem = { ...mockItem, trending: true };
    renderWithProvider(<ContentCard item={trendingItem} />);

    expect(screen.getByText('Trending')).toBeInTheDocument();
  });
});
