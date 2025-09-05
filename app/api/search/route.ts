import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""

  try {
    // Search across multiple APIs (here just NewsAPI for demo)
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&apiKey=${process.env.NEWS_API_KEY}`
    )
    const data = await res.json()

    const items = (data.articles || []).map((a: any, i: number) => ({
      id: `search-${i}`,
      title: a.title,
      description: a.description,
      url: a.url,
      image: a.urlToImage,
      category: "search",
      publishedAt: a.publishedAt,
      source: a.source?.name,
    }))

    return NextResponse.json(items)
  } catch (_err) {
    return NextResponse.json({ error: "Failed to search" }, { status: 500 })
  }
}