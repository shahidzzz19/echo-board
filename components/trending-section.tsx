'use client';

import { useEffect, useState } from 'react';
import { PersonalizedFeed } from './PersonalizedFeed';
import { ContentItem } from '@/lib/slices/contentSlice';

export function TrendingSection() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch('/api/trending');
        if (!res.ok) throw new Error('Failed to fetch trending content');
        const data: ContentItem[] = await res.json();
        setItems(data.slice(0, 10)); // limit to 10 items
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrending();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading trending content...</p>;
  }

  if (!items.length) {
    return <p className="text-center text-gray-500">No trending content available.</p>;
  }

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">{'🔥 Your Personalized Feed'}</h2>
      <PersonalizedFeed items={items} />
    </section>
  );
}
