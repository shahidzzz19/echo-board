import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ContentItem } from "./contentSlice"

interface SearchState {
  query: string
  results: ContentItem[]
  loading: boolean
  error: string | null
  filters: {
    type: string[]
    category: string[]
    dateRange: string
  }
}

const initialState: SearchState = {
  query: "",
  results: [],
  loading: false,
  error: null,
  filters: {
    type: [],
    category: [],
    dateRange: "all",
  },
}

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload
    },
    setResults: (state, action: PayloadAction<ContentItem[]>) => {
      state.results = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    updateFilters: (state, action: PayloadAction<Partial<SearchState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearSearch: (state) => {
      state.query = ""
      state.results = []
      state.error = null
    },
  },
})

export const { setQuery, setResults, setLoading, setError, updateFilters, clearSearch } = searchSlice.actions

export default searchSlice.reducer
