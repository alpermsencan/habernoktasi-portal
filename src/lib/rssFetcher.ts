import Parser from 'rss-parser';
import slugify from 'slugify';
import { RSSSource, RawRSSItem, ParsedNewsItem } from '@/types/news';

export const DEFAULT_RSS_SOURCES: RSSSource[] = [
  {
    id: 'trt-haber',
    name: 'TRT Haber',
    category: 'Gündem',
    url: 'https://www.trthaber.com/sondakika.rss',
    enabled: true,
  },
  {
    id: 'ntv-gundem',
    name: 'NTV',
    category: 'Gündem',
    url: 'https://www.ntv.com.tr/turkiye.rss',
    enabled: true,
  },
  {
    id: 'ntv-teknoloji',
    name: 'NTV Teknoloji',
    category: 'Teknoloji',
    url: 'https://www.ntv.com.tr/teknoloji.rss',
    enabled: true,
  },
  {
    id: 'sozcu-sondakika',
    name: 'Sözcü',
    category: 'Gündem',
    url: 'https://www.sozcu.com.tr/feeds-son-dakika',
    enabled: true,
  },
  {
    id: 'hurriyet-anasayfa',
    name: 'Hürriyet',
    category: 'Gündem',
    url: 'https://www.hurriyet.com.tr/rss/anasayfa',
    enabled: true,
  },
  {
    id: 'ensonhaber',
    name: 'Ensonhaber',
    category: 'Gündem',
    url: 'https://www.ensonhaber.com/rss/ensonhaber.xml',
    enabled: true,
  },
];

/**
 * Configure RSS parser with custom XML tags commonly used by Turkish media outlets
 */
const parser = new Parser<Record<string, unknown>, RawRSSItem>({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['content:encoded', 'contentEncoded'],
      ['enclosure', 'enclosure'],
      ['description', 'description'],
    ],
  },
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (HaberNoktasi/1.0; +https://www.habernoktasi.com.tr)',
    Accept: 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*',
  },
  timeout: 12000,
});

/**
 * Utility to strip HTML tags and decode common XML/HTML entities
 */
export function cleanHtmlText(rawText: string | null | undefined): string {
  if (!rawText) return '';
  return rawText
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/<style([\s\S]*?)<\/style>/gi, '')
    .replace(/<script([\s\S]*?)<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Hierarchical image extraction algorithm tailored for Turkish news RSS feeds:
 * 1. enclosure.url (TRT Haber, Habertürk vb.)
 * 2. media:content.$.url or media:content.url (NTV, Sözcü vb.)
 * 3. <img src="..."> in description or content:encoded (Hürriyet, Milliyet vb.)
 */
export function extractImageUrl(item: RawRSSItem): string | null {
  // 1. Check enclosure.url
  if (item.enclosure) {
    if (typeof item.enclosure.url === 'string' && item.enclosure.url.trim().length > 0) {
      return item.enclosure.url.trim();
    }
    if (item.enclosure.$?.url && typeof item.enclosure.$.url === 'string') {
      return item.enclosure.$.url.trim();
    }
  }

  // 2. Check media:content (object, array or nested under $)
  const mediaContent = item.mediaContent || item['media:content'];
  if (mediaContent) {
    if (typeof mediaContent.url === 'string' && mediaContent.url.trim().length > 0) {
      return mediaContent.url.trim();
    }
    if (mediaContent.$?.url && typeof mediaContent.$.url === 'string') {
      return mediaContent.$.url.trim();
    }
    // If mediaContent is an array
    if (Array.isArray(mediaContent) && mediaContent.length > 0) {
      const first = mediaContent[0];
      if (first?.url) return first.url.trim();
      if (first?.$?.url) return first.$.url.trim();
    }
  }

  // 3. Fallback: Regex scan for <img ... src="..."> in HTML bodies
  const htmlPool = [
    item['content:encoded'],
    item.contentEncoded,
    item.content,
    item.description,
    item.summary,
  ].filter(Boolean) as string[];

  const imgRegex = /<img[^>]+src=["'](https?:\/\/[^"'>]+)["']/i;

  for (const html of htmlPool) {
    const match = html.match(imgRegex);
    if (match && match[1]) {
      const foundUrl = match[1].trim();
      // Exclude 1x1 tracking pixels or icon gifs
      if (!foundUrl.includes('tracking') && !foundUrl.endsWith('.gif')) {
        return foundUrl;
      }
    }
  }

  return null;
}

/**
 * Fetch and parse a single RSS feed source safely with error isolation
 */
export async function fetchFeed(source: RSSSource): Promise<ParsedNewsItem[]> {
  try {
    const feed = await parser.parseURL(source.url);
    if (!feed || !feed.items || feed.items.length === 0) {
      return [];
    }

    const parsedArticles: ParsedNewsItem[] = [];

    for (const item of feed.items) {
      const title = cleanHtmlText(item.title);
      if (!title || title.length < 5) continue;

      const link = item.link?.trim() || '';
      if (!link) continue;

      // Unique GUID determination
      const guid = item.guid?.trim() || item.id?.trim() || link;

      // Description/Summary
      const summary = cleanHtmlText(item.summary || item.contentSnippet || item.description);
      const content = cleanHtmlText(item.contentEncoded || item.content || item.description) || summary;

      // Image URL extraction
      const rawImageUrl = extractImageUrl(item);

      // Slug creation
      const slug = slugify(title, {
        lower: true,
        strict: true,
        locale: 'tr',
        remove: /[*+~.()'"!:@/]/g,
      }).slice(0, 75);

      // Date parsing
      let publishedAt = new Date().toISOString();
      if (item.isoDate) {
        publishedAt = new Date(item.isoDate).toISOString();
      } else if (item.pubDate) {
        const parsedDate = new Date(item.pubDate);
        if (!isNaN(parsedDate.getTime())) {
          publishedAt = parsedDate.toISOString();
        }
      }

      parsedArticles.push({
        guid,
        title,
        slug,
        summary: summary || title,
        content: content || summary || title,
        sourceLink: link,
        sourceName: source.name,
        category: source.category,
        rawImageUrl,
        publishedAt,
      });
    }

    return parsedArticles;
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.warn(`[RSS Parser Warning] Failed to fetch feed "${source.name}" (${source.url}): ${errMessage}`);
    return [];
  }
}

/**
 * Fetch all enabled RSS sources in parallel with promise settling
 */
export async function fetchAllFeeds(sources: RSSSource[] = DEFAULT_RSS_SOURCES): Promise<{
  articles: ParsedNewsItem[];
  sourceStats: { sourceName: string; fetched: number; error?: string }[];
}> {
  const enabledSources = sources.filter((s) => s.enabled !== false);
  const results = await Promise.allSettled(enabledSources.map((s) => fetchFeed(s)));

  const allArticles: ParsedNewsItem[] = [];
  const sourceStats: { sourceName: string; fetched: number; error?: string }[] = [];

  results.forEach((res, index) => {
    const source = enabledSources[index];
    if (res.status === 'fulfilled') {
      allArticles.push(...res.value);
      sourceStats.push({
        sourceName: source.name,
        fetched: res.value.length,
      });
    } else {
      sourceStats.push({
        sourceName: source.name,
        fetched: 0,
        error: res.reason?.message || 'Unknown network error',
      });
    }
  });

  return { articles: allArticles, sourceStats };
}
