import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { ContentItem } from "../slices/contentSlice"

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true"

// Mock content generator
const generateMockContent = (
  type: "news" | "recommendation" | "social",
  count = 10
): ContentItem[] => {
  const categories = ["technology", "sports", "finance", "entertainment", "health", "science"]
  const sources: Record<"news" | "recommendation" | "social", string[]> = {
    news: ["TechCrunch", "BBC News", "Reuters", "CNN"],
    recommendation: ["Netflix", "Spotify", "Amazon Prime", "YouTube"],
    social: ["Twitter", "Instagram", "LinkedIn", "Facebook"],
  }

  return Array.from({ length: count }, (_, i) => ({
    id: `${type}-${Date.now()}-${i}`,
    type,
    title: `${
      type === "news" ? "Breaking:" : type === "recommendation" ? "Recommended:" : "Trending:"
    } Sample ${type} ${i + 1}`,
    description: `This is a sample ${type} description.`,
    image: `/placeholder.svg?height=200&width=300&text=${type}`,
    url: `#${type}-${i}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    publishedAt: new Date(
      Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
    source: sources[type][Math.floor(Math.random() * sources[type].length)],
    trending: Math.random() > 0.7,
  }))
}

export const contentApi = createApi({
  reducerPath: "contentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["Content", "Trending", "Search"],
  endpoints: (builder) => ({

    // Personalized feed
    getPersonalizedContent: builder.query<
      ContentItem[],
      { categories: string[]; page: number; pageSize?: number }
    >({
      queryFn: async ({ categories, page, pageSize = 10 }) => {
        if (USE_MOCK) {
          const items = [
            ...generateMockContent("news", pageSize),
            ...generateMockContent("recommendation", pageSize),
            ...generateMockContent("social", pageSize),
          ].filter((item) => categories.length === 0 || categories.includes(item.category))
          return { data: items }
        }

        try {
          const [newsRes, recRes, socialRes] = await Promise.all([
            fetch(`/api/news?category=${categories[0] || "technology"}&page=${page}&pageSize=${pageSize}`)
              .then((res) => res.json()),
            fetch(`/api/recommendations?page=${page}&pageSize=${pageSize}`).then((res) => res.json()),
            fetch(`/api/social?hashtag=tech&page=${page}&pageSize=${pageSize}`).then((res) => res.json()),
          ])

          const newsItems: ContentItem[] = (newsRes || []).map((item: any, i: number) => ({
            id: `news-${page}-${i}`,
            type: "news",
            title: item.title ?? "Untitled",
            description: item.description ?? "",
            image: item.image ?? "",
            url: item.url ?? "#",
            category: item.category ?? "general",
            publishedAt: item.publishedAt ?? new Date().toISOString(),
            source: item.source ?? "Unknown",
            trending: item.trending ?? false,
          }))

          const recItems: ContentItem[] = (recRes || []).map((item: any, i: number) => ({
            id: item.id ?? `rec-${page}-${i}`,
            type: "recommendation",
            title: item.title ?? "Untitled",
            description: item.description ?? "",
            image: item.image ?? "",
            url: item.url ?? "#",
            category: item.category ?? "general",
            publishedAt: item.publishedAt ?? new Date().toISOString(),
            source: item.source ?? "Unknown",
            trending: item.trending ?? false,
          }))

          const socialItems: ContentItem[] = (socialRes || []).map((item: any, i: number) => ({
            id: `social-${page}-${i}`,
            type: "social",
            title: item.title ?? "Untitled",
            description: item.description ?? "",
            image: item.image ?? "",
            url: item.url ?? "#",
            category: item.category ?? "general",
            publishedAt: item.publishedAt ?? new Date().toISOString(),
            source: item.source ?? "Unknown",
            trending: item.trending ?? false,
          }))

          return { data: [...newsItems, ...recItems, ...socialItems] }
        } catch (err) {
          return { error: { status: 500, data: "Failed to fetch content" } }
        }
      },
    }),

    // News
    getNews: builder.query<ContentItem[], { category: string; page?: number; pageSize?: number }>({
      query: ({ category, page = 1, pageSize = 10 }) =>
        `/api/news?category=${category}&page=${page}&pageSize=${pageSize}`,
      transformResponse: (response: ContentItem[], _meta, arg) =>
        USE_MOCK ? generateMockContent("news", arg.pageSize ?? 10) : response,
    }),

    // Recommendations
    getRecommendations: builder.query<ContentItem[], { page?: number; pageSize?: number } | void>({
      query: ({ page = 1, pageSize = 10 } = {}) =>
        `/api/recommendations?page=${page}&pageSize=${pageSize}`,
      transformResponse: (response: ContentItem[], _meta, arg) =>
        USE_MOCK ? generateMockContent("recommendation", arg?.pageSize ?? 10) : response,
    }),

    // Social posts
    getSocialPosts: builder.query<ContentItem[], { hashtag: string; page?: number; pageSize?: number }>({
      query: ({ hashtag, page = 1, pageSize = 10 }) =>
        `/api/social?hashtag=${hashtag}&page=${page}&pageSize=${pageSize}`,
      transformResponse: (response: ContentItem[], _meta, arg) =>
        USE_MOCK ? generateMockContent("social", arg.pageSize ?? 10) : response,
    }),

    // Trending content
    getTrendingContent: builder.query<ContentItem[], void>({
      queryFn: async () => {
        if (USE_MOCK) {
          const items = [
            ...generateMockContent("news", 3),
            ...generateMockContent("recommendation", 2),
            ...generateMockContent("social", 3),
          ]
          return { data: items }
        }

        try {
          const res = await fetch("/api/trending").then((r) => r.json())
          return { data: res as ContentItem[] }
        } catch (err) {
          return { error: { status: 500, data: "Failed to fetch trending" } }
        }
      },
      providesTags: ["Trending"],
    }),

    // Search content
    searchContent: builder.query<ContentItem[], { query: string }>({
      queryFn: async ({ query }) => {
        if (USE_MOCK) {
          const allItems = [
            ...generateMockContent("news", 10),
            ...generateMockContent("recommendation", 8),
            ...generateMockContent("social", 12),
          ]
          return {
            data: allItems.filter(
              (item) =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase())
            ),
          }
        }

        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`).then((r) => r.json())
          return { data: res as ContentItem[] }
        } catch (err) {
          return { error: { status: 500, data: "Failed to search content" } }
        }
      },
      providesTags: ["Search"],
    }),
  }),
})

export const {
  useGetPersonalizedContentQuery,
  useGetNewsQuery,
  useGetRecommendationsQuery,
  useGetSocialPostsQuery,
  useGetTrendingContentQuery,
  useSearchContentQuery,
} = contentApi