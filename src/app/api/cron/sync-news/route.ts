import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { fetchAllFeeds } from '@/lib/rssFetcher';
import { downloadAndProcessImage } from '@/lib/imageHandler';
import { articleExists, saveArticle } from '@/lib/newsRepository';
import { INewsArticle, SyncNewsResult } from '@/types/news';

// Disable caching for cron handler
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60; // 60 seconds max execution for batch image processing

export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    // 1. Security Authentication Check
    const { searchParams } = new URL(request.url);
    const querySecret = searchParams.get('secret');

    const authHeader = request.headers.get('authorization') || '';
    const bearerToken = authHeader.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7).trim()
      : null;

    const configuredSecret = process.env.CRON_SECRET || 'dev-secret-key-123';
    const providedToken = querySecret || bearerToken;

    if (!providedToken || providedToken !== configuredSecret) {
      return NextResponse.json(
        {
          success: false,
          error: 'Yetkisiz erişim. Geçerli bir CRON_SECRET belirtilmedi.',
          hint: 'İstek URL parametresi (?secret=...) veya Authorization: Bearer <TOKEN> başlığı kullanın.',
        },
        { status: 401 }
      );
    }

    // 2. Fetch all configured Turkish RSS feeds
    console.log('[Cron Sync] Starting Turkish RSS feeds synchronization...');
    const { articles: rawFeedArticles, sourceStats } = await fetchAllFeeds();

    let newArticlesAdded = 0;
    let duplicatesSkipped = 0;
    let imagesDownloaded = 0;
    let failedImages = 0;

    const addedPerSource: Record<string, number> = {};

    // 3. Process each article sequentially or in small concurrency batches to preserve server memory on Hostinger
    for (const rawItem of rawFeedArticles) {
      // Check for duplication against existing GUID or Source Link
      const alreadyExists = await articleExists(rawItem.guid, rawItem.sourceLink);

      if (alreadyExists) {
        duplicatesSkipped++;
        continue;
      }

      // Download and optimize external image to local WebP
      let localImagePath = '/placeholder.webp';
      if (rawItem.rawImageUrl) {
        localImagePath = await downloadAndProcessImage(rawItem.rawImageUrl, rawItem.title);
        if (localImagePath !== '/placeholder.webp') {
          imagesDownloaded++;
        } else {
          failedImages++;
        }
      }

      // Build full structured news article model
      const newArticle: INewsArticle = {
        id: `rss-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        guid: rawItem.guid,
        title: rawItem.title,
        slug: rawItem.slug,
        summary: rawItem.summary,
        content: rawItem.content,
        sourceLink: rawItem.sourceLink,
        sourceName: rawItem.sourceName,
        category: rawItem.category,
        imageUrl: localImagePath,
        publishedAt: rawItem.publishedAt,
        createdAt: new Date().toISOString(),
      };

      await saveArticle(newArticle);
      newArticlesAdded++;

      addedPerSource[rawItem.sourceName] = (addedPerSource[rawItem.sourceName] || 0) + 1;
    }

    // 4. Revalidate Next.js App Router Cache for Instant Front-End Updates
    try {
      revalidatePath('/');
      revalidatePath('/kategori/gundem');
      revalidatePath('/kategori/teknoloji');
      revalidatePath('/kategori/ekonomi');
      revalidatePath('/kategori/spor');
    } catch (revalidateErr) {
      console.warn('[Cron Sync Revalidation Warning]', revalidateErr);
    }

    const durationMs = Date.now() - startTime;

    const responsePayload: SyncNewsResult = {
      success: true,
      message: `Haber senkronizasyonu tamamlandı. ${newArticlesAdded} yeni haber eklendi, ${duplicatesSkipped} mükerrer haber atlandı. (${durationMs}ms)`,
      timestamp: new Date().toISOString(),
      stats: {
        totalSourcesChecked: sourceStats.length,
        totalFeedsFetched: rawFeedArticles.length,
        newArticlesAdded,
        duplicatesSkipped,
        imagesDownloaded,
        failedImages,
      },
      sources: sourceStats.map((s) => ({
        sourceName: s.sourceName,
        fetched: s.fetched,
        added: addedPerSource[s.sourceName] || 0,
        error: s.error,
      })),
    };

    console.log(`[Cron Sync Completed] Added: ${newArticlesAdded}, Duplicates: ${duplicatesSkipped}, Time: ${durationMs}ms`);

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Cron Sync Error]', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Haber senkronizasyonu sırasında beklenmeyen bir hata oluştu.',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// Support both GET and POST for maximum flexibility with various cron providers (Hostinger, cPanel, Vercel, curl)
export const POST = GET;

