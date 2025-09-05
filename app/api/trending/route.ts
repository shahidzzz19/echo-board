import { NextResponse } from "next/server"

const NEWS_API_KEY = process.env.NEWS_API_KEY as string
const TMDB_API_KEY = process.env.TMDB_API_KEY as string

export async function GET() {
  try {
    // Fetch in parallel
    const [newsRes, tmdbRes, redditRes] = await Promise.all([
      fetch(`https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${NEWS_API_KEY}`),
      fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}&page=1`),
      fetch(`https://www.reddit.com/r/popular/hot.json?limit=5`),
    ])

    const [newsData, tmdbData, redditData] = await Promise.all([
      newsRes.json(),
      tmdbRes.json(),
      redditRes.json(),
    ])

    // Map NewsAPI articles
    const newsItems = (newsData.articles || []).map((article: any, i: number) => ({
      id: `trending-news-${i}`,
      type: "news",
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.urlToImage,
      publishedAt: article.publishedAt,
      source: article.source?.name,
      category: "news",
      trending: true,
    }))

    // Map TMDB results
    const recItems = (tmdbData.results || []).slice(0, 5).map((item: any) => ({
      id: `trending-rec-${item.id}`,
      type: "recommendation",
      title: item.title || item.name,
      description: item.overview,
      url: `https://www.themoviedb.org/${item.media_type}/${item.id}`,
      image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
      publishedAt: item.release_date || item.first_air_date,
      source: "TMDB",
      category: "entertainment",
      trending: true,
    }))

    // Map Reddit posts
    const socialItems = (redditData.data.children || []).map((post: any, i: number) => ({
      id: `trending-social-${i}`,
      type: "social",
      title: post.data.title,
      description: post.data.selftext || "No description",
      url: `https://reddit.com${post.data.permalink}`,
      image: post.data.thumbnail && post.data.thumbnail.startsWith("http") ? post.data.thumbnail : null,
      publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
      source: "Reddit",
      category: "social",
      trending: true,
    }))

    // Merge all feeds
    const trending = [...newsItems, ...recItems, ...socialItems]

    return NextResponse.json(trending)
  } catch (err) {
    console.error("Error fetching trending data:", err)
    return NextResponse.json({ error: "Failed to fetch trending content" }, { status: 500 })
  }
}