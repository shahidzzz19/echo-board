'use client';

import { motion } from 'framer-motion';
import { Heart, ExternalLink, Clock, Tag } from 'lucide-react';
import Image from 'next/image';
import clsx from 'clsx';
import { useState } from 'react';
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { toggleFavorite } from '@/lib/slices/userSlice';
import type { ContentItem } from '@/lib/slices/contentSlice';

interface ContentCardProps {
  item: ContentItem;
  className?: string;
}

export function ContentCard({ item, className }: ContentCardProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.user.favorites);
  const isFavorite = favorites.includes(item.id);
  const [imgError, setImgError] = useState(false);

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(item.id));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'news':
        return 'bg-blue-500';
      case 'recommendation':
        return 'bg-green-500';
      case 'social':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const isSafeDomain = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return [
        'images.unsplash.com',
        'cdn.vox-cdn.com',
        'static01.nyt.com',
        'www.cnet.com',
        'kotaku.com',
        'i.redd.it',
        'preview.redd.it',
        'external-preview.redd.it',
      ].includes(hostname);
    } catch {
      return false;
    }
  };

  const imageUrl = !imgError && item.image ? item.image : '/placeholder.svg';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={clsx('h-full', className)}
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          {isSafeDomain(imageUrl) ? (
            <Image
              src={imageUrl}
              alt={item.title || 'Content image'}
              width={400}
              height={200}
              className="w-full h-full object-cover transition-transform hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <img
              src={imageUrl}
              alt={item.title || 'Content image'}
              className="w-full h-full object-cover transition-transform hover:scale-105"
              onError={() => setImgError(true)}
            />
          )}

          {/* Type Badge */}
          <div className="absolute top-2 left-2">
            <Badge className={`${getTypeColor(item.type)} text-white text-xs`}>{item.type}</Badge>
          </div>

          {/* Trending Badge */}
          {item.trending && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive" className="text-xs">
                Trending
              </Badge>
            </div>
          )}
        </div>

        {/* Title */}
        <CardHeader className="pb-2 px-3 sm:px-6">
          <h3 className="font-semibold line-clamp-2 text-sm sm:text-base leading-tight">
            {item.title}
          </h3>
        </CardHeader>

        {/* Description + Metadata */}
        <CardContent className="flex-1 pb-2 px-3 sm:px-6">
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-3">
            {item.description}
          </p>

          <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground flex-wrap">
            <Tag className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{item.category}</span>
            <Clock className="h-3 w-3 ml-1 sm:ml-2 flex-shrink-0" />
            <span className="truncate">{formatDate(item.publishedAt)}</span>
          </div>
        </CardContent>

        {/* Footer: Source + Actions */}
        <CardFooter className="pt-2 px-3 sm:px-6 flex items-center justify-between">
          <div className="text-xs text-muted-foreground truncate flex-1 mr-2">{item.source}</div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Favorite Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              className={clsx('h-8 w-8 p-0', { 'text-red-500': isFavorite })}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={clsx('h-4 w-4', { 'fill-current': isFavorite })} />
            </Button>

            {/* External Link */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 w-8 p-0"
              aria-label="Open article"
            >
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
