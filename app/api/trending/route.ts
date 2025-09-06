import { NextResponse } from "next/server";
import { ContentItem } from "@/lib/types";
import { generateId, safeImage } from "@/lib/utils";

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET() {
  if (!NEWS_API_KEY || !TMDB_API_KEY) {
    return NextResponse.json({ error: "API keys are missing" }, { status: 500 });
  }

  try {
    const [newsRes, tmdbRes, redditRes] = await Promise.all([
      fetch(`https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${NEWS_API_KEY}`),
      fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}&page=1`),
      fetch(`https://www.reddit.com/r/popular/hot.json?limit=5`),
    ]);

    const [newsData, tmdbData, redditData] = await Promise.all([newsRes.json(), tmdbRes.json(), redditRes.json()]);

    const newsItems: ContentItem[] = (newsData.articles || []).map((a: any, i: number) => ({
      id: generateId("trending-news", i),
      type: "news",
      title: a.title || "No title",
      description: a.description || null,
      url: a.url,
      image: safeImage(a.urlToImage),
      category: "news",
      publishedAt: a.publishedAt || new Date().toISOString(),
      source: a.source?.name || "Unknown",
      trending: true,
    }));

    const recItems: ContentItem[] = (tmdbData.results || []).slice(0, 5).map((m: any) => ({
      id: generateId("trending-rec", m.id),
      type: "recommendation",
      title: m.title || m.name || "No title",
      description: m.overview || null,
      url: `https://www.themoviedb.org/${m.media_type}/${m.id}`,
      image: safeImage(m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null),
      category: "entertainment",
      publishedAt: m.release_date || m.first_air_date || new Date().toISOString(),
      source: "TMDB",
      trending: true,
    }));

    const socialItems: ContentItem[] = (redditData.data.children || []).map((post: any) => ({
      id: generateId("trending-social", post.data.id),
      type: "social",
      title: post.data.title || "No title",
      description: post.data.selftext || null,
      url: `https://reddit.com${post.data.permalink}`,
      image: safeImage(post.data.thumbnail),
      category: "social",
      publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
      source: "Reddit",
      trending: true,
    }));

    return NextResponse.json([...newsItems, ...recItems, ...socialItems]);
  } catch (err) {
    console.error("Trending fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch trending content" }, { status: 500 });
  }
}