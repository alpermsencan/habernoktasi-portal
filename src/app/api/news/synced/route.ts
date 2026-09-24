import { NextRequest, NextResponse } from 'next/server';
import { getLatestNews } from '@/lib/newsRepository';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit')) || 24, 100);
    const category = searchParams.get('category') || undefined;

    const articles = await getLatestNews(limit, category);

    return NextResponse.json({
      success: true,
      total: articles.length,
      data: articles,
    });
  } catch (error) {
    console.error('Failed to get synced news:', error);
    return NextResponse.json(
      { success: false, error: 'Haberler listelenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
