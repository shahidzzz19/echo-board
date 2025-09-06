'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import {
  setItems,
  appendItems,
  setLoading,
  setError,
  ContentItem,
} from '@/lib/slices/contentSlice';
import { ContentSkeleton } from './content-skeleton';
import { DraggableContentCard } from './draggable-content-card';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';

// Generic fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ContentFeed() {
  const dispatch = useAppDispatch();
  const { preferences } = useAppSelector((state) => state.user);
  const { items } = useAppSelector((state) => state.content);

  const getKey = (pageIndex: number, previousPageData: ContentItem[] | null) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/api/trending?page=${pageIndex + 1}&categories=${preferences.categories.join(',')}`;
  };

  const { data, error, isLoading, size, setSize, isValidating } = useSWRInfinite<ContentItem[]>(
    getKey,
    fetcher,
  );

  const flatItems = useMemo(() => {
    if (!data) return [];
    const merged: ContentItem[] = ([] as ContentItem[]).concat(...data);
    const unique = Array.from(new Map(merged.map((i) => [i.id, i])).values());
    return unique;
  }, [data]);

  useEffect(() => {
    if (flatItems.length > 0) {
      if (size === 1) {
        dispatch(setItems(flatItems));
      } else {
        dispatch(appendItems(flatItems));
      }
    }
  }, [flatItems, size, dispatch]);

  useEffect(() => {
    dispatch(setLoading(isLoading || isValidating));
    if (error) dispatch(setError('Failed to load content'));
  }, [isLoading, isValidating, error, dispatch]);

  const loadMore = useCallback(() => {
    if (!isLoading && !isValidating) setSize(size + 1);
  }, [isLoading, isValidating, size, setSize]);

  const [lastElementRef] = useInfiniteScroll(loadMore, isLoading);

  if (isLoading && size === 1) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Your Personalized Feed</h2>
        <div
          className={`grid gap-6 ${
            preferences.layout === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <ContentSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Personalized Feed</h2>
        <div className="text-sm text-muted-foreground">{items.length} items</div>
      </div>

      <motion.div
        className={`grid gap-3 sm:gap-4 lg:gap-6 ${
          preferences.layout === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
            : 'grid-cols-1'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {items.map((item, index) => (
          <div
            key={item.id || `feed-item-${index}`}
            ref={index === items.length - 1 ? lastElementRef : null}
          >
            <DraggableContentCard item={item} index={index} />
          </div>
        ))}
      </motion.div>

      {isLoading && size > 1 && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {!isLoading && !isValidating && items.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No items found for your preferences.
        </div>
      )}
    </div>
  );
}
