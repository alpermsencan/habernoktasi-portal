import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { parseEnsonhaberRSS, ParsedNews } from '@/lib/rssParser';
import { downloadAndOptimizeImage } from '@/lib/imageDownloader';
import { distributeNews, DistributableArticle } from '@/lib/newsDistributor';
import { articleExists, saveArticle } from '@/lib/newsRepository';
import { INewsArticle } from '@/types/news';

// Disable Next.js caching for this cron endpoint
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60; // 60s timeout for processing batches

const DEFAULT_SECRET = 'super_secret_cron_token_haber_noktasi_2026';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    // 1. Security Authentication Check (Query parameter or Bearer token)
    const { searchParams } = new URL(request.url);
    const querySecret = searchParams.get('secret');

    const authHeader = request.headers.get('authorization') || '';
    const bearerToken = authHeader.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7).trim()
      : null;

    const configuredSecret = process.env.CRON_SECRET || DEFAULT_SECRET;
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

    console.log('[Cron Sync] Ensonhaber RSS senkronizasyonu başlatılıyor...');

    // 2. Fetch and parse Ensonhaber RSS feed
    const rawArticles: ParsedNews[] = await parseEnsonhaberRSS();
    console.log(`[Cron Sync] Ensonhaber RSS'den ${rawArticles.length} haber ayrıştırıldı.`);

    if (rawArticles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ensonhaber RSS akışından haber çekilemedi veya akış boş döndü.',
        },
        { status: 502 }
      );
    }

    let newArticlesAdded = 0;
    let duplicatesSkipped = 0;
    let imagesDownloaded = 0;

    const distributableList: DistributableArticle[] = [];

    // 3. Process articles: download and optimize images with Sharp into WebP
    for (const item of rawArticles) {
      // Check for duplication in repository
      const exists = await articleExists(item.guid, item.link);
      if (exists) {
        duplicatesSkipped++;
      }

      // Download and optimize image to local public/uploads/news/ directory
      let localImagePath = '/placeholder.webp';
      if (item.imageUrl) {
        localImagePath = await downloadAndOptimizeImage(item.imageUrl, item.title, {
          width: 1200,
          height: 675,
          quality: 80,
          folder: 'news',
        });

        if (localImagePath !== '/placeholder.webp') {
          imagesDownloaded++;
        }
      }

      // If not duplicate, save into permanent repository/DB
      if (!exists) {
        const newRecord: INewsArticle = {
          id: `ensonhaber-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          guid: item.guid,
          title: item.title,
          slug: item.link.split('/').filter(Boolean).pop() || `haber-${Date.now()}`,
          summary: item.summary,
          content: item.summary,
          sourceLink: item.link,
          sourceName: 'Ensonhaber',
          category: item.normalizedCategory,
          imageUrl: localImagePath,
          publishedAt: item.pubDate || new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };

        try {
          await saveArticle(newRecord);
          newArticlesAdded++;
        } catch (dbErr) {
          console.warn('[Cron Sync DB Save Warning]', dbErr);
        }
      }

      // Add to list for frontpage distribution
      distributableList.push({
        title: item.title,
        summary: item.summary,
        category: item.normalizedCategory,
        normalizedCategory: item.normalizedCategory,
        categorySlug: item.categorySlug,
        imageUrl: localImagePath,
        image: localImagePath,
        pubDate: item.pubDate,
        date: item.pubDate,
        link: item.link,
      });
    }

    // 4. Distribute news to homepage blocks (newsData.json)
    console.log('[Cron Sync] Ana sayfa bloklarına haber dağıtımı başlatılıyor...');
    const distributionResult = await distributeNews(distributableList);
    console.log('[Cron Sync] Dağıtım tamamlandı:', distributionResult);

    // 5. Revalidate Next.js App Router cache for instantaneous front-end reflect
    try {
      revalidatePath('/');
      revalidatePath('/ensonhaber');
      revalidatePath('/kategori/gundem');
      revalidatePath('/kategori/ekonomi');
      revalidatePath('/kategori/spor');
      revalidatePath('/kategori/teknoloji');
      revalidatePath('/kategori/dunya');
      revalidatePath('/kategori/kelebek');
      revalidatePath('/kategori/saglik');
    } catch (revalidateErr) {
      console.warn('[Cron Sync Cache Revalidation Warning]', revalidateErr);
    }

    const durationMs = Date.now() - startTime;

    return NextResponse.json(
      {
        success: true,
        message: `Ensonhaber RSS başarıyla senkronize edildi ve ana sayfa bloklarına dağıtıldı. (${durationMs}ms)`,
        timestamp: new Date().toISOString(),
        stats: {
          totalFetched: rawArticles.length,
          newArticlesAdded,
          duplicatesSkipped,
          imagesDownloaded,
          durationMs,
        },
        distribution: {
          headlineSliderCount: distributionResult.sliderCount,
          breakingNewsCount: distributionResult.breakingCount,
          sicakGundemCount: distributionResult.sicakCount,
          sliderSideNewsCount: distributionResult.sideCount,
          updatedCategories: distributionResult.updatedCategories,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Cron Sync Error]', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Ensonhaber RSS senkronizasyonu sırasında hata oluştu.',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// Support both GET and POST requests for external cron providers (Hostinger, cPanel, EasyCron, etc.)
export const POST = GET;
