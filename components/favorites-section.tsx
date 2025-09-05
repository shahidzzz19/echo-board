"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { updateFavoriteItems } from "@/lib/slices/contentSlice"
import { ContentCard } from "./content-card"

export function FavoritesSection() {
  const dispatch = useAppDispatch()
  const { favorites } = useAppSelector((state) => state.user)
  const { items, favoriteItems } = useAppSelector((state) => state.content)
  const { preferences } = useAppSelector((state) => state.user)

  useEffect(() => {
    const favItems = items.filter((item) => favorites.includes(item.id))
    dispatch(updateFavoriteItems(favItems))
  }, [favorites, items, dispatch])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          <h2 className="text-2xl font-bold">Your Favorites</h2>
        </div>
        <div className="text-sm text-muted-foreground">{favoriteItems.length} favorite items</div>
      </div>

      {favoriteItems.length > 0 ? (
        <motion.div
          className={`grid gap-3 sm:gap-4 lg:gap-6 ${
            preferences.layout === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {favoriteItems.map((item) => (
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
          <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No favorite items yet</p>
          <p className="text-sm">Start adding items to your favorites by clicking the heart icon</p>
        </div>
      )}
    </div>
  )
}
