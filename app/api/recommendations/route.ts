import { NextRequest, NextResponse } from "next/server"

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_KEY

export async function GET(req: NextRequest) {
  if (!TMDB_KEY) {
    return NextResponse.json({ error: "TMDB API key missing" }, { status: 500 })
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=1`
    )
    const data = await res.json()

    const items = (data.results || []).map((movie: any) => ({
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

    return NextResponse.json(items)
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}