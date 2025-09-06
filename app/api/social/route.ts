import { NextResponse } from "next/server"
import { ContentItem } from "@/lib/types"
import { generateId, safeImage } from "@/lib/utils"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const hashtag = searchParams.get("hashtag") || "technology"
  const pageSize = Number(searchParams.get("pageSize") || 10)

  try {
    const res = await fetch(`https://www.reddit.com/r/${hashtag}/hot.json?limit=${pageSize}`)
    const data = await res.json()

    const items: ContentItem[] = (data.data.children || []).map((post: any) => ({
      id: generateId("social", post.data.id),
      type: "social",
      title: post.data.title || "No title",
      description: post.data.selftext || null,
      url: `https://reddit.com${post.data.permalink}`,
      image: safeImage(post.data.thumbnail),
      category: hashtag,
      publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
      source: "Reddit",
    }))

    return NextResponse.json(items)
  } catch (err) {
    console.error("Social fetch error:", err)
    return NextResponse.json({ error: "Failed to fetch social posts" }, { status: 500 })
  }
}
