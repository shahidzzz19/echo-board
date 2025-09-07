// app/api/reddit/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || 'trending';

  try {
    const redditRes = await fetch(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=5`,
      {
        headers: { 'User-Agent': 'EchoBoardApp/1.0' },
      },
    );

    if (!redditRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch from Reddit' },
        { status: redditRes.status },
      );
    }

    const data = await redditRes.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Reddit API error:', err);
    return NextResponse.json({ error: 'Reddit fetch failed' }, { status: 500 });
  }
}
