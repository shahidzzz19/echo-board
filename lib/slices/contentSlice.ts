import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface ContentItem {
  id: string
  type: "news" | "recommendation" | "social"
  title: string
  description: string
  image: string
  url: string
  category: string
  publishedAt: string
  source: string
  trending?: boolean
}

interface ContentState {
  items: ContentItem[]
  trendingItems: ContentItem[]
  favoriteItems: ContentItem[]
  loading: boolean
  error: string | null
  hasMore: boolean
  page: number
}

const initialState: ContentState = {
  items: [],
  trendingItems: [],
  favoriteItems: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
}

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload
    },
    appendItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.items.push(...action.payload)
    },
    setTrendingItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.trendingItems = action.payload
    },
    updateFavoriteItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.favoriteItems = action.payload
    },
    reorderItems: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload
      const [removed] = state.items.splice(fromIndex, 1)
      state.items.splice(toIndex, 0, removed)
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload
    },
    incrementPage: (state) => {
      state.page += 1
    },
    resetPage: (state) => {
      state.page = 1
    },
  },
})

export const {
  setLoading,
  setError,
  setItems,
  appendItems,
  setTrendingItems,
  updateFavoriteItems,
  reorderItems,
  setHasMore,
  incrementPage,
  resetPage,
} = contentSlice.actions

export default contentSlice.reducer
