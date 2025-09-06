import { NextResponse } from "next/server";
import { ContentItem } from "@/lib/types";
import { generateId, safeImage } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&apiKey=${process.env.NEWS_API_KEY}`
    );
    const data = await res.json();

    const items: ContentItem[] = (data.articles || []).map((a: any, i: number) => ({
      id: generateId("search", i),
      type: "search",
      title: a.title || "No title",
      description: a.description || null,
      url: a.url,
      image: safeImage(a.urlToImage),
      category: "search",
      publishedAt: a.publishedAt || new Date().toISOString(),
      source: a.source?.name || "Unknown",
    }));

    return NextResponse.json(items);
  } catch (err) {
    console.error("Search fetch error:", err);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}