import { NextResponse } from "next/server";
import { ContentItem } from "@/lib/types";
import { generateId, safeImage } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.TMDB_API_KEY}&page=${page}`
    );
    const data = await res.json();

    const items: ContentItem[] = (data.results || []).map((m: any) => ({
      id: generateId("rec", m.id),
      type: "recommendation",
      title: m.title || m.name || "No title",
      description: m.overview || null,
      url: `https://www.themoviedb.org/${m.media_type}/${m.id}`,
      image: safeImage(m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null),
      category: m.media_type || "entertainment",
      publishedAt: m.release_date || m.first_air_date || new Date().toISOString(),
      source: "TMDB",
    }));

    return NextResponse.json(items);
  } catch (err) {
    console.error("Recommendations fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}