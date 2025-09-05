import { NextResponse } from "next/server";
import { ContentItem } from "@/lib/slices/contentSlice";

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY!;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY!;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const categories = (url.searchParams.get("categories") || "general").split(",");
  const page = parseInt(url.searchParams.get("page") || "1", 10);

  const items: ContentItem[] = [];

  // Fetch news per category
  for (const category of categories) {
    try {
      const newsRes = await fetch(
        `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${NEWS_API_KEY}`
      );
      const newsData = await newsRes.json();
      if (newsData.articles) {
        items.push(
          ...newsData.articles.map((article: any, i: number) => ({
            id: `news-${Date.now()}-${i}`,
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
        );
      }
    } catch (_err) {
      console.error("News fetch error:", _err);
    }
  }

  // Fetch TMDB popular movies as recommendations
  try {
    const recRes = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
    );
    const recData = await recRes.json();
    if (recData.results) {
      items.push(
        ...recData.results.map((movie: any) => ({
          id: `movie-${movie.id}`,
          type: "recommendation",
          title: movie.title,
          description: movie.overview,
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          url: `https://www.themoviedb.org/movie/${movie.id}`,
          category: "entertainment",
          publishedAt: movie.release_date,
          source: "TMDB",
          trending: false,
        }))
      );
    }
  } catch (_err) {
    console.error("TMDB fetch error:", _err);
  }

  return NextResponse.json(items);
}