import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category") || "technology"
  const page = searchParams.get("page") || "1"
  const pageSize = searchParams.get("pageSize") || "10"

  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${process.env.NEWS_API_KEY}`
    )
    const data = await res.json()

    const items = (data.articles || []).map((a: any, i: number) => ({
      id: `news-${page}-${i}`,
      title: a.title,
      description: a.description,
      url: a.url,
      image: a.urlToImage,
      category,
      publishedAt: a.publishedAt,
      source: a.source?.name,
    }))

    return NextResponse.json(items)
  } catch (_err) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}