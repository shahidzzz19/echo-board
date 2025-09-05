"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { useSearchContentQuery } from "@/lib/api/contentApi"
import { setResults, setLoading, setError } from "@/lib/slices/searchSlice"
import { ContentCard } from "./content-card"
import { ContentSkeleton } from "./content-skeleton"

export function SearchResults() {
  const dispatch = useAppDispatch()
  const { query, results, filters } = useAppSelector((state) => state.search)
  const { preferences } = useAppSelector((state) => state.user)

  const { data, isLoading, error } = useSearchContentQuery({ query, filters }, { skip: !query.trim() })

  useEffect(() => {
    if (data) {
      dispatch(setResults(data))
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(setLoading(isLoading))
    if (error) {
      dispatch(setError("Failed to search content"))
    }
  }, [isLoading, error, dispatch])

  if (!query.trim()) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Start typing to search for content</p>
      </div>
    )
  }

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
            preferences.layout === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {results.map((item) => (
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
