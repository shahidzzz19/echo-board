"use client"

import React from "react"
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd"
import { useAppDispatch } from "@/lib/hooks"
import { reorderItems } from "@/lib/slices/contentSlice"
import { ContentCard } from "./content-card"
import type { ContentItem } from "@/lib/slices/contentSlice"

interface DraggableContentCardProps {
  item: ContentItem
  index: number
}

// Define type for drag item
interface DragItem {
  index: number
  type: string
}

export function DraggableContentCard({ item, index }: DraggableContentCardProps) {
  const dispatch = useAppDispatch()

  // Drag hook
  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: "content-card",
    item: { index, type: "content-card" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  // Drop hook with correct type
  const [, drop] = useDrop<DragItem, void, unknown>({
    accept: "content-card",
    hover(draggedItem: DragItem, monitor: DropTargetMonitor) {
      if (!monitor.isOver({ shallow: true })) return
      if (draggedItem.index === index) return

      dispatch(reorderItems({ fromIndex: draggedItem.index, toIndex: index }))
      draggedItem.index = index
    },
  })

  return (
    <div
      ref={(node) => {
        if (node) drag(drop(node))
      }}
      className={`cursor-move ${isDragging ? "opacity-50" : "opacity-100"} transition-opacity`}
    >
      <ContentCard item={item} />
    </div>
  )
}