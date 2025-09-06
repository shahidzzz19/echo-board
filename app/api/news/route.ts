import { NextResponse } from "next/server"
import { ContentItem } from "@/lib/types"
import { generateId, safeImage } from "@/lib/utils"

interface NewsApiArticle {
  title: string
  description: string | null
  url: string
  urlToImage?: string | null
  publishedAt?: string
  source?: { name: string }
}

interface NewsApiResponse {
  articles: NewsApiArticle[]
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category") || "technology"
  const page = Number(searchParams.get("page") || 1)
  const pageSize = Number(searchParams.get("pageSize") || 10)

  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${process.env.NEWS_API_KEY}`,
    )
    const data: NewsApiResponse = await res.json()

    const items: ContentItem[] = data.articles.map((a, i) => ({
      id: generateId("news", `${page}-${i}`),
      type: "news",
      title: a.title || "No title",
      description: a.description,
      url: a.url,
      image: safeImage(a.urlToImage),
      category,
      publishedAt: a.publishedAt || new Date().toISOString(),
      source: a.source?.name || "Unknown",
    }))

    return NextResponse.json(items)
  } catch (err) {
    console.error("News fetch error:", err)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
