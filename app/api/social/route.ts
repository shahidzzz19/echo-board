import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const hashtag = searchParams.get("hashtag") || "technology"
  const pageSize = parseInt(searchParams.get("pageSize") || "10")

  try {
    const res = await fetch(
      `https://www.reddit.com/r/${hashtag}/hot.json?limit=${pageSize}`
    )
    const data = await res.json()

    const items = (data.data.children || []).map((post: any) => ({
      id: `social-${post.data.id}`,
      title: post.data.title,
      description: post.data.selftext || "",
      url: `https://reddit.com${post.data.permalink}`,
      image: post.data.thumbnail?.startsWith("http") ? post.data.thumbnail : null,
      category: hashtag,
      publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
      source: "Reddit",
    }))

    return NextResponse.json(items)
  } catch (_err) {
    return NextResponse.json({ error: "Failed to fetch social posts" }, { status: 500 })
  }
}