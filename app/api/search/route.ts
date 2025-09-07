// app/api/search/route.ts
import { NextResponse } from 'next/server';
import { ContentItem } from '@/lib/types';
import { generateId, safeImage } from '@/lib/utils';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.trim();

  if (!query) {
    return NextResponse.json([], { status: 200 });
  }

  let newsItems: ContentItem[] = [];
  let tmdbItems: ContentItem[] = [];

  try {
    // Fetch both APIs in parallel
    const results = await Promise.allSettled([
      fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=5&apiKey=${NEWS_API_KEY}`,
      ),
      fetch(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&page=1&api_key=${TMDB_API_KEY}`,
      ),
    ]);

    // NEWS API
    if (results[0].status === 'fulfilled' && results[0].value.ok) {
      const newsData = await results[0].value.json();
      newsItems = (newsData.articles || []).map((a: any, i: number) => ({
        id: generateId('search-news', i),
        type: 'news',
        title: a.title || 'No title',
        description: a.description || null,
        url: a.url,
        image: safeImage(a.urlToImage),
        category: 'news',
        publishedAt: a.publishedAt || new Date().toISOString(),
        source: a.source?.name || 'Unknown',
        trending: false,
      }));
    }

    // TMDB API
    if (results[1].status === 'fulfilled' && results[1].value.ok) {
      const tmdbData = await results[1].value.json();
      tmdbItems = (tmdbData.results || []).slice(0, 5).map((m: any) => ({
        id: generateId('search-tmdb', m.id),
        type: 'recommendation',
        title: m.title || m.name || 'No title',
        description: m.overview || null,
        url: `https://www.themoviedb.org/${m.media_type}/${m.id}`,
        image: safeImage(m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null),
        category: 'entertainment',
        publishedAt: m.release_date || m.first_air_date || new Date().toISOString(),
        source: 'TMDB',
        trending: false,
      }));
    }

    return NextResponse.json([...newsItems, ...tmdbItems]);
  } catch (err) {
    console.error('Search fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }
}
