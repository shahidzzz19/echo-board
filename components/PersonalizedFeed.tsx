'use client';

import Image from 'next/image';

interface FeedItem {
  id: string;
  title: string;
  description: string;
  url: string;
  image?: string | null;
  source?: string;
  category?: string;
  publishedAt?: string;
}

export function PersonalizedFeed({ items }: { items: FeedItem[] }) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Your Personalized Feed</h2>

      {items.length === 0 ? (
        <p className="text-gray-500">No items available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              {/* Image with fallback */}
              <div className="relative h-48 w-full bg-gray-200">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title || 'Feed image'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                    No image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1 line-clamp-2">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">{item.description}</p>
                )}

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{item.source || 'Unknown source'}</span>
                  {item.publishedAt && (
                    <span>
                      {new Date(item.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-blue-600 text-sm font-medium hover:underline"
                >
                  Read more →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
