import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ContentItem } from '../slices/contentSlice';
import { generateId, safeImage } from '../utils';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

interface SearchQueryArgs {
  query: string;
  filters?: { category?: string[] };
}

export const contentApi = createApi({
  reducerPath: 'contentApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    searchContent: builder.query<ContentItem[], SearchQueryArgs>({
      async queryFn({ query }) {
        if (!query.trim()) return { data: [] };

        try {
          // News API
          let newsData: any = { articles: [] };
          try {
            const newsRes = await fetch(
              `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=5&apiKey=${NEWS_API_KEY}`,
            );
            if (newsRes.ok) newsData = await newsRes.json();
          } catch (err) {
            console.error('News fetch failed:', err);
          }

          // TMDB API
          let tmdbData: any = { results: [] };
          try {
            const tmdbRes = await fetch(
              `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
                query,
              )}&api_key=${TMDB_API_KEY}&page=1`,
            );
            if (tmdbRes.ok) tmdbData = await tmdbRes.json();
          } catch (err) {
            console.error('TMDB fetch failed:', err);
          }

          // Reddit API (via proxy route to avoid CORS)
          let redditData: any = { data: { children: [] } };
          try {
            const redditRes = await fetch(`/api/reddit?q=${encodeURIComponent(query)}`);
            if (redditRes.ok) redditData = await redditRes.json();
          } catch (err) {
            console.error('Reddit fetch failed:', err);
          }

          // Format News
          const newsItems: ContentItem[] = (newsData.articles || []).map((a: any, i: number) => ({
            id: generateId('news', i),
            type: 'news',
            title: a.title || 'No title',
            description: a.description || null,
            url: a.url,
            image: safeImage(a.urlToImage),
            category: 'news',
            publishedAt: a.publishedAt || new Date().toISOString(),
            source: a.source?.name || 'Unknown',
            trending: true,
          }));

          // Format TMDB
          const recItems: ContentItem[] = (tmdbData.results || []).slice(0, 5).map((m: any) => ({
            id: generateId('rec', m.id),
            type: 'recommendation',
            title: m.title || m.name || 'No title',
            description: m.overview || null,
            url: m.media_type
              ? `https://www.themoviedb.org/${m.media_type}/${m.id}`
              : 'https://www.themoviedb.org/',
            image: safeImage(
              m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
            ),
            category: 'entertainment',
            publishedAt: m.release_date || m.first_air_date || new Date().toISOString(),
            source: 'TMDB',
            trending: true,
          }));

          // Format Reddit
          const socialItems: ContentItem[] = (redditData.data.children || []).map((post: any) => ({
            id: generateId('social', post.data.id),
            type: 'social',
            title: post.data.title || 'No title',
            description: post.data.selftext || null,
            url: `https://reddit.com${post.data.permalink}`,
            image: safeImage(post.data.thumbnail),
            category: 'social',
            publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
            source: 'Reddit',
            trending: true,
          }));

          // Combine results
          return { data: [...newsItems, ...recItems, ...socialItems] };
        } catch (err) {
          console.error('Search fetch failed:', err);
          return {
            error: {
              status: 'FETCH_ERROR',
              error: 'Failed to fetch search results',
            },
          };
        }
      },
    }),
  }),
});

export const { useSearchContentQuery } = contentApi;
