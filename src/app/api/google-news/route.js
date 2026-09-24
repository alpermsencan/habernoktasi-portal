import { NextResponse } from 'next/server';
import { fetchGoogleNews } from '@/lib/googleNews';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'all';
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const news = await fetchGoogleNews(category, limit);

  return NextResponse.json({
    success: true,
    count: news.length,
    category,
    data: news,
  });
}
