import { NextRequest, NextResponse } from "next/server"

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category") || "general"

  if (!NEWS_API_KEY) {
    return NextResponse.json({ error: "News API key missing" }, { status: 500 })
  }

  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?category=${category}&pageSize=10&apiKey=${NEWS_API_KEY}`
    )
    const data = await res.json()

    const items = (data.articles || []).map((article: any, i: number) => ({
      id: `news-${i}`,
      type: "news",
      title: article.title,
      description: article.description,
      image: article.urlToImage,
      url: article.url,
      category,
      publishedAt: article.publishedAt,
      source: article.source?.name || "Unknown",
      trending: false,
    }))

    return NextResponse.json(items)
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}