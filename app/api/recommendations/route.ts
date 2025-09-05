import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get("page") || "1"

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.TMDB_API_KEY}&page=${page}`
    )
    const data = await res.json()

    const items = (data.results || []).map((m: any) => ({
      id: `rec-${m.id}`,
      title: m.title || m.name,
      description: m.overview,
      url: `https://www.themoviedb.org/${m.media_type}/${m.id}`,
      image: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
      category: m.media_type,
      publishedAt: m.release_date || m.first_air_date,
      source: "TMDB",
    }))

    return NextResponse.json(items)
  } catch (_err) {
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}