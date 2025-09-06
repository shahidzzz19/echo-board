import { NextResponse } from "next/server"
import { ContentItem } from "@/lib/types"
import { generateId, safeImage } from "@/lib/utils"

interface NewsArticle {
  title: string
  description: string | null
  url: string
  urlToImage?: string | null
  publishedAt?: string
  source?: { name: string }
}

interface TMDBMovie {
  id: number
  title?: string
  overview?: string
  poster_path?: string | null
  release_date?: string
}

export async function GET(req: Request) {
  const NEWS_API_KEY = process.env.NEWS_API_KEY
  const TMDB_API_KEY = process.env.TMDB_API_KEY

  if (!NEWS_API_KEY || !TMDB_API_KEY) {
    return NextResponse.json({ error: "API keys missing" }, { status: 500 })
  }

  const url = new URL(req.url)
  const categories = (url.searchParams.get("categories") || "general").split(",")
  const page = Number(url.searchParams.get("page") || 1)

  try {
    const newsPromises = categories.map(async (category) => {
      const res = await fetch(`https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${NEWS_API_KEY}`)
      const data: { articles: NewsArticle[] } = await res.json()
      return data.articles.map(
        (a, i): ContentItem => ({
          id: generateId("news", `${category}-${i}`),
          type: "news",
          title: a.title || "No title",
          description: a.description,
          url: a.url,
          image: safeImage(a.urlToImage),
          category,
          publishedAt: a.publishedAt || new Date().toISOString(),
          source: a.source?.name || "Unknown",
          trending: false,
        }),
      )
    })

    const recRes = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`)
    const recData: { results: TMDBMovie[] } = await recRes.json()

    const recItems: ContentItem[] = recData.results.map((movie) => ({
      id: generateId("movie", movie.id),
      type: "recommendation",
      title: movie.title || "No title",
      description: movie.overview || null,
      url: `https://www.themoviedb.org/movie/${movie.id}`,
      image: safeImage(movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null),
      category: "entertainment",
      publishedAt: movie.release_date || new Date().toISOString(),
      source: "TMDB",
      trending: false,
    }))

    const newsItems = (await Promise.all(newsPromises)).flat()
    return NextResponse.json([...newsItems, ...recItems])
  } catch (err) {
    console.error("Personalized content fetch error:", err)
    return NextResponse.json({ error: "Failed to fetch personalized content" }, { status: 500 })
  }
}
