import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { ContentItem } from "../slices/contentSlice"

type SearchFilters = {
  category?: string[]
}

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true"

// Centralized mock generator
const generateMockContent = (types: ("news" | "recommendation" | "social")[], countPerType = 10): ContentItem[] => {
  const categories = ["technology", "sports", "finance", "entertainment", "health", "science"]
  const sources = {
    news: ["TechCrunch", "BBC News", "Reuters", "CNN"],
    recommendation: ["Netflix", "Spotify", "Amazon Prime", "YouTube"],
    social: ["Twitter", "Instagram", "LinkedIn", "Facebook"],
  }

  return types.flatMap((type) =>
    Array.from({ length: countPerType }, (_, i) => ({
      id: `${type}-${Date.now()}-${i}`,
      type,
      title: `${type === "news" ? "Breaking:" : type === "recommendation" ? "Recommended:" : "Trending:"} Sample ${type} ${i + 1}`,
      description: `This is a sample ${type} description.`,
      image: `/placeholder.svg?height=200&width=300&text=${type}`,
      url: `#${type}-${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: sources[type][Math.floor(Math.random() * sources[type].length)],
      trending: Math.random() > 0.7,
    })),
  )
}

export const contentApi = createApi({
  reducerPath: "contentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["Content", "Trending", "Search"],
  endpoints: (builder) => ({
    // Personalized feed
    getPersonalizedContent: builder.query<ContentItem[], { categories: string[]; page: number; pageSize?: number }>({
      queryFn: async ({ categories, page, pageSize = 10 }) => {
        if (USE_MOCK) {
          const items = generateMockContent(["news", "recommendation", "social"], pageSize)
          return { data: categories.length ? items.filter((item) => categories.includes(item.category)) : items }
        }

        try {
          const [newsRes, recRes, socialRes] = await Promise.all([
            fetch(`/api/news?category=${categories[0] || "technology"}&page=${page}&pageSize=${pageSize}`).then((res) =>
              res.json(),
            ),
            fetch(`/api/recommendations?page=${page}&pageSize=${pageSize}`).then((res) => res.json()),
            fetch(`/api/social?hashtag=tech&page=${page}&pageSize=${pageSize}`).then((res) => res.json()),
          ])

          const mapItems = (res: any[], type: "news" | "recommendation" | "social") =>
            (res || []).map((item, i) => ({ id: `${type}-${page}-${i}`, type, ...item }))

          return {
            data: [
              ...mapItems(newsRes, "news"),
              ...mapItems(recRes, "recommendation"),
              ...mapItems(socialRes, "social"),
            ],
          }
        } catch (_err) {
          return { error: { status: 500, data: "Failed to fetch content" } }
        }
      },
    }),

    // News
    getNews: builder.query<ContentItem[], { category: string; page?: number; pageSize?: number }>({
      query: ({ category, page = 1, pageSize = 10 }) =>
        `/api/news?category=${category}&page=${page}&pageSize=${pageSize}`,
      transformResponse: (response: any, _meta, arg) =>
        USE_MOCK ? generateMockContent(["news"], arg.pageSize ?? 10) : response,
    }),

    // Recommendations
    getRecommendations: builder.query<ContentItem[], { page?: number; pageSize?: number } | void>({
      query: ({ page = 1, pageSize = 10 } = {}) => `/api/recommendations?page=${page}&pageSize=${pageSize}`,
      transformResponse: (response: any, _meta, arg) =>
        USE_MOCK ? generateMockContent(["recommendation"], arg?.pageSize ?? 10) : response,
    }),

    // Social
    getSocialPosts: builder.query<ContentItem[], { hashtag: string; page?: number; pageSize?: number }>({
      query: ({ hashtag, page = 1, pageSize = 10 }) =>
        `/api/social?hashtag=${hashtag}&page=${page}&pageSize=${pageSize}`,
      transformResponse: (response: any, _meta, arg) =>
        USE_MOCK ? generateMockContent(["social"], arg.pageSize ?? 10) : response,
    }),

    // Trending
    getTrendingContent: builder.query<ContentItem[], void>({
      queryFn: async () => {
        if (USE_MOCK) return { data: generateMockContent(["news", "recommendation", "social"], 3) }

        try {
          const res = await fetch("/api/trending").then((r) => r.json())
          return { data: (res || []).filter((item: any) => ["news", "recommendation", "social"].includes(item.type)) }
        } catch (_err) {
          return { error: { status: 500, data: "Failed to fetch trending" } }
        }
      },
      providesTags: ["Trending"],
    }),

    // Search with optional filters
    searchContent: builder.query<ContentItem[], { query: string; filters?: SearchFilters }>({
      queryFn: async ({ query, filters }) => {
        if (USE_MOCK) {
          let items = generateMockContent(["news", "recommendation", "social"], 12)
          let filtered = items.filter(
            (item) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.description.toLowerCase().includes(query.toLowerCase()),
          )

          if (filters?.category?.length) {
            filtered = filtered.filter((item) => filters.category!.includes(item.category))
          }

          return { data: filtered }
        }

        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`).then((r) => r.json())
          return { data: (res || []).filter((item: any) => ["news", "recommendation", "social"].includes(item.type)) }
        } catch (_err) {
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
