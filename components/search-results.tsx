"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { useSearchContentQuery } from "@/lib/api/contentApi"
import { setResults, setLoading, setError } from "@/lib/slices/searchSlice"
import { ContentCard } from "./content-card"
import { ContentSkeleton } from "./content-skeleton"

// Use ContentItem type from contentSlice to ensure compatibility
import type { ContentItem } from "@/lib/slices/contentSlice"

// Optional: define search state type
interface SearchState {
  query: string
  results: ContentItem[]
}

interface UserPreferences {
  layout: "grid" | "list"
}

// Type for search query args with optional filters
type SearchQueryArgs = {
  query: string
  filters?: { category?: string[] }
}

export function SearchResults() {
  const dispatch = useAppDispatch()

  const { query, results } = useAppSelector((state: any) => state.search as SearchState)
  const { preferences } = useAppSelector((state: any) => state.user as { preferences: UserPreferences })

  // Call RTK Query endpoint with optional filters
  const { data, isLoading, error } = useSearchContentQuery(
    { query } as SearchQueryArgs,
    { skip: !query.trim() }
  )

  // Update Redux results
  useEffect(() => {
    if (data) {
      dispatch(setResults(data as ContentItem[]))
    }
  }, [data, dispatch])

  // Update loading and error
  useEffect(() => {
    dispatch(setLoading(isLoading))
    if (error) {
      dispatch(setError("Failed to search content"))
    }
  }, [isLoading, error, dispatch])

  // No query UI
  if (!query.trim()) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Start typing to search for content</p>
      </div>
    )
  }

  // Loading UI
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Search className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Searching for "{query}"</h2>
        </div>
        <div
          className={`grid gap-6 ${preferences.layout === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <ContentSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  // Results UI
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Search Results for "{query}"</h2>
        </div>
        <div className="text-sm text-muted-foreground">{results.length} results found</div>
      </div>

      {results.length > 0 ? (
        <motion.div
          className={`grid gap-3 sm:gap-4 lg:gap-6 ${
            preferences.layout === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {results.map((item: ContentItem) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ContentCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No results found for "{query}"</p>
          <p className="text-sm">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  )
}