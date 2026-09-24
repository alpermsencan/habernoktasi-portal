import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { parseEnsonhaberRSS, ParsedNews } from '@/lib/rssParser';
import { downloadAndProcessImage } from '@/lib/imageHandler';
import { distributeNews, DistributableArticle } from '@/lib/newsDistributor';
import { articleExists, saveArticle } from '@/lib/newsRepository';
import { INewsArticle } from '@/types/news';

// Disable Next.js caching for this cron endpoint
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60; // 60s timeout for processing batches

const DEFAULT_SECRET = 'super_secret_cron_token_haber_noktasi_2026';

/**
 * Normalizes raw RSS categories to portal standards:
 * - "Futbol", "Basketbol", "Milli Takımlar", "Boks" -> "Spor"
 * - "3. Sayfa", "İç Haber", "Asayiş" -> "Gündem"
 * - "Dünya", "Ekonomi", "Teknoloji", "Otomobil", "Magazin" -> Standard
 */
function standardizeCategory(rawCat: string = ''): string {
  const c = rawCat.trim().toLowerCase();
  if (/futbol|basketbol|milli\s*takım|boks|voleybol|spor/i.test(c)) return 'Spor';
  if (/3\.\s*sayfa|iç\s*haber|asayiş|politika|siyaset/i.test(c)) return 'Gündem';
  if (/ekonomi|piyasa|finans|borsa/i.test(c)) return 'Ekonomi';
  if (/teknoloji|bilim|yapay\s*zeka|otomobil|yazılım/i.test(c)) return 'Teknoloji';
  if (/dünya|dunya|uluslararası|global/i.test(c)) return 'Dünya';
  if (/magazin|kelebek|kültür|sanat|sinema|dizi/i.test(c)) return 'Magazin';
  if (/sağlık|saglik|tıp/i.test(c)) return 'Sağlık';
  return 'Gündem';
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    // 1. Security Authentication Check (Query parameter ?secret=... or Authorization: Bearer <TOKEN>)
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
          hint: 'İstek URL parametresi (?secret=CRON_SECRET) veya Authorization: Bearer <TOKEN> başlığı kullanın.',
        },
        { status: 401 }
      );
    }

    console.log('[Cron Sync] Ensonhaber RSS akışı çekiliyor (https://www.ensonhaber.com/rss/ensonhaber.xml)...');

    // 2. Fetch and parse Ensonhaber RSS feed
    const rawArticles: ParsedNews[] = await parseEnsonhaberRSS('https://www.ensonhaber.com/rss/ensonhaber.xml');
    console.log(`[Cron Sync] Ensonhaber RSS'den ${rawArticles.length} haber başarıyla ayrıştırıldı.`);

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

    // 3. Process articles, download images via lib/imageHandler, categorize and flag
    for (let index = 0; index < rawArticles.length; index++) {
      const item = rawArticles[index];

      // Mükerrer haber kontrolü (guid veya link)
      const exists = await articleExists(item.guid, item.link);
      if (exists) {
        duplicatesSkipped++;
      }

      // Kategori standardizasyonu
      const standardCat = standardizeCategory(item.category);

      // En son gelen ilk 5-10 haberi otomatik olarak isHeadline: true (Manşet Slider) olarak işaretle
      const isHeadline = index < 10;

      // Yayınlanma saati son 2 saat içinde olanları veya "Gündem / 3. Sayfa" olanları isBreaking: true (Son Dakika) olarak ata
      const pubTime = item.pubDate ? new Date(item.pubDate).getTime() : NaN;
      const isWithin2Hours = !isNaN(pubTime) && (Date.now() - pubTime) <= 2 * 60 * 60 * 1000;
      const isGundemOr3Sayfa = /gündem|3\.\s*sayfa|iç\s*haber/i.test(item.category);
      const isBreaking = isWithin2Hours || isGundemOr3Sayfa;

      // Dış görsel URL'sini sharp ile 1200x675 WebP olarak indir ve public/uploads/news/ dizinine kaydet
      let localImagePath = '/placeholder.webp';
      if (item.imageUrl) {
        localImagePath = await downloadAndProcessImage(item.imageUrl, item.title);
        if (localImagePath !== '/placeholder.webp') {
          imagesDownloaded++;
        }
      }

      // Veritabanına kaydet (Eğer mükerrer değilse)
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
          category: standardCat,
          imageUrl: localImagePath,
          publishedAt: item.pubDate || new Date().toISOString(),
          createdAt: new Date().toISOString(),
          isHeadline,
          isBreaking,
        };

        try {
          await saveArticle(newRecord);
          newArticlesAdded++;
        } catch (dbErr) {
          console.warn('[Cron Sync DB Save Warning]', dbErr);
        }
      }

      // Dağıtıcı listesine ekle
      distributableList.push({
        title: item.title,
        summary: item.summary,
        category: standardCat,
        normalizedCategory: standardCat,
        categorySlug: standardCat.toLowerCase() === 'magazin' ? 'kelebek' : standardCat.toLowerCase(),
        imageUrl: localImagePath,
        image: localImagePath,
        pubDate: item.pubDate,
        date: item.pubDate,
        link: item.link,
      });
    }

    // 4. Ana sayfa bloklarına haber dağıtımı yap
    console.log('[Cron Sync] Ana sayfa bloklarına haber dağıtımı başlatılıyor...');
    const distributionResult = await distributeNews(distributableList);

    // 5. İşlem bittiğinde revalidatePath('/') çalıştırarak önbelleği anında tazele
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

// Support both GET and POST for maximum compatibility with server cron providers
export const POST = GET;
