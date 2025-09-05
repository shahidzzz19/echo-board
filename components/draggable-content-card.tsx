"use client"

import { useDrag, useDrop } from "react-dnd"
import { useAppDispatch } from "@/lib/hooks"
import { reorderItems } from "@/lib/slices/contentSlice"
import { ContentCard } from "./content-card"
import type { ContentItem } from "@/lib/slices/contentSlice"

interface DraggableContentCardProps {
  item: ContentItem
  index: number
}

export function DraggableContentCard({ item, index }: DraggableContentCardProps) {
  const dispatch = useAppDispatch()

  const [{ isDragging }, drag] = useDrag({
    type: "content-card",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: "content-card",
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        dispatch(reorderItems({ fromIndex: draggedItem.index, toIndex: index }))
        draggedItem.index = index
      }
    },
  })

  return (
    <div ref={(node) => drag(drop(node))} className={`cursor-move ${isDragging ? "dragging" : ""}`}>
      <ContentCard item={item} />
    </div>
  )
}
