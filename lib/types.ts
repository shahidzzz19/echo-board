export interface ContentItem {
  id: string;
  type: 'news' | 'recommendation' | 'social' | 'search';
  title: string;
  description: string | null;
  url: string;
  image: string | null;
  category: string;
  publishedAt: string;
  source: string;
  trending?: boolean;
}
