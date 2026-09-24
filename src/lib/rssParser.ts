import Parser from 'rss-parser';

export interface ParsedNews {
  title: string;
  link: string;
  guid: string;
  summary: string;
  category: string;
  normalizedCategory: string;
  categorySlug: string;
  pubDate: string;
  imageUrl: string | null;
}

interface CustomItem {
  title?: string;
  link?: string;
  guid?: string;
  description?: string;
  category?: string;
  pubDate?: string;
  isoDate?: string;
  mediaContent?: {
    $?: {
      url?: string;
      medium?: string;
      type?: string;
      width?: string;
      height?: string;
    };
    url?: string;
  };
  'media:content'?: {
    $?: {
      url?: string;
      medium?: string;
    };
    url?: string;
  };
  enclosure?: {
    url?: string;
    $?: {
      url?: string;
    };
  };
  [key: string]: unknown;
}

/**
 * Configure rss-parser with Ensonhaber XML custom fields:
 * - <media:content medium="image" url="..." />
 * - <description><![CDATA[...]]></description>
 * - <category>...</category>
 * - <guid>...</guid>
 */
const parser = new Parser<Record<string, unknown>, CustomItem>({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['description', 'description'],
      ['category', 'category'],
      ['guid', 'guid'],
    ],
  },
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (HaberNoktasiBot/1.0)',
    Accept: 'application/rss+xml, application/xml, text/xml, */*',
  },
  timeout: 12000,
});

/**
 * Strips HTML tags, CDATA delimiters, and decodes HTML entities
 */
export function cleanDescription(rawText: string | null | undefined): string {
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
 * Robust image extraction matching Ensonhaber's exact XML structure:
 * 1. item.mediaContent.$['url']
 * 2. item['media:content'].$['url']
 * 3. item.enclosure.url
 * 4. Regex fallback inside description HTML (<img src="...">)
 */
export function extractMediaImageUrl(item: CustomItem): string | null {
  // 1. media:content under $ attributes (rss-parser XML attr mapping)
  if (item.mediaContent?.$?.url && typeof item.mediaContent.$.url === 'string') {
    const u = item.mediaContent.$.url.trim();
    if (u.startsWith('http')) return u;
  }
  if (typeof item.mediaContent?.url === 'string' && item.mediaContent.url.startsWith('http')) {
    return item.mediaContent.url.trim();
  }

  // 2. Raw XML tag 'media:content'
  if (item['media:content']?.$?.url && typeof item['media:content'].$.url === 'string') {
    const u = item['media:content'].$.url.trim();
    if (u.startsWith('http')) return u;
  }
  if (typeof item['media:content']?.url === 'string' && item['media:content'].url.startsWith('http')) {
    return item['media:content'].url.trim();
  }

  // 3. Array of media:content (if multiple)
  if (Array.isArray(item.mediaContent) && item.mediaContent.length > 0) {
    for (const m of item.mediaContent) {
      const candidate = m?.$?.url || m?.url;
      if (typeof candidate === 'string' && candidate.startsWith('http')) {
        return candidate.trim();
      }
    }
  }

  // 4. Enclosure check
  if (item.enclosure?.url && typeof item.enclosure.url === 'string') {
    return item.enclosure.url.trim();
  }
  if (item.enclosure?.$?.url && typeof item.enclosure.$.url === 'string') {
    return item.enclosure.$.url.trim();
  }

  // 5. Fallback: Regex search for <img src="..."> in description/content
  const rawHtml = (item.description || '') + ' ' + (item['content:encoded'] || '');
  if (rawHtml) {
    const match = rawHtml.match(/<img[^>]+src=["'](https?:\/\/[^"'>]+)["']/i);
    if (match && match[1] && !match[1].endsWith('.gif') && !match[1].includes('tracking')) {
      return match[1].trim();
    }
  }

  return null;
}

/**
 * Normalizes Ensonhaber's diverse category tags to standard portal categories:
 * - "İç Haber", "3. Sayfa", "Gündem", "Siyaset", "Asayiş" -> "Gündem"
 * - "Futbol", "Boks", "Basketbol", "Spor" -> "Spor"
 * - "Ekonomi", "Finans", "Borsa", "Piyasalar" -> "Ekonomi"
 * - "Dünya", "Dış Haber", "Ortadoğu", "Balkanlar" -> "Dünya"
 * - "Otomobil", "Teknoloji", "Bilim", "Yapay Zeka" -> "Teknoloji"
 * - "Magazin", "Kültür", "Sanat", "Kelebek", "Dizi" -> "Kelebek"
 * - "Sağlık", "Beslenme", "Tıp" -> "Sağlık"
 */
export function normalizeCategory(rawCat: string | null | undefined): { name: string; slug: string } {
  if (!rawCat) return { name: 'Gündem', slug: 'gundem' };
  const lower = rawCat.trim().toLowerCase();

  if (
    lower.includes('spor') ||
    lower.includes('futbol') ||
    lower.includes('boks') ||
    lower.includes('basket') ||
    lower.includes('lig')
  ) {
    return { name: 'Spor', slug: 'spor' };
  }

  if (
    lower.includes('ekonomi') ||
    lower.includes('finans') ||
    lower.includes('borsa') ||
    lower.includes('altın') ||
    lower.includes('döviz')
  ) {
    return { name: 'Ekonomi', slug: 'ekonomi' };
  }

  if (
    lower.includes('teknoloji') ||
    lower.includes('oto') ||
    lower.includes('araba') ||
    lower.includes('bilim') ||
    lower.includes('yapay')
  ) {
    return { name: 'Teknoloji', slug: 'teknoloji' };
  }

  if (
    lower.includes('dünya') ||
    lower.includes('dış') ||
    lower.includes('abd') ||
    lower.includes('avrupa') ||
    lower.includes('rusya')
  ) {
    return { name: 'Dünya', slug: 'dunya' };
  }

  if (
    lower.includes('magazin') ||
    lower.includes('kelebek') ||
    lower.includes('yaşam') ||
    lower.includes('sanat') ||
    lower.includes('dizi')
  ) {
    return { name: 'Kelebek', slug: 'kelebek' };
  }

  if (
    lower.includes('sağlık') ||
    lower.includes('tıp') ||
    lower.includes('beslenme') ||
    lower.includes('korona')
  ) {
    return { name: 'Sağlık', slug: 'saglik' };
  }

  // Default fallback for "İç Haber", "3. Sayfa", "Gündem", "Siyaset", "Köşe Yazısı", etc.
  return { name: 'Gündem', slug: 'gundem' };
}

/**
 * Fetch and parse Ensonhaber RSS feed without missing any images or categories
 */
export async function parseEnsonhaberRSS(
  feedUrl = 'https://www.ensonhaber.com/rss/ensonhaber.xml'
): Promise<ParsedNews[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    if (!feed || !feed.items || feed.items.length === 0) {
      return [];
    }

    return feed.items
      .map((item) => {
        const title = (item.title || '').trim();
        const link = (item.link || '').trim();
        const guid = (item.guid || link || '').trim();
        const summary = cleanDescription(item.description) || title;
        const rawCategory = (item.category || 'Gündem').trim();
        const normalized = normalizeCategory(rawCategory);

        let pubDate = new Date().toISOString();
        if (item.isoDate) {
          pubDate = new Date(item.isoDate).toISOString();
        } else if (item.pubDate) {
          const parsed = new Date(item.pubDate);
          if (!isNaN(parsed.getTime())) pubDate = parsed.toISOString();
        }

        const imageUrl = extractMediaImageUrl(item);

        return {
          title,
          link,
          guid,
          summary,
          category: normalized.name,
          normalizedCategory: normalized.name,
          categorySlug: normalized.slug,
          pubDate,
          imageUrl,
        };
      })
      .filter((n) => n.title.length > 5 && n.link.length > 0);
  } catch (error: any) {
    console.error('[Ensonhaber RSS Error]', error.message || error);
    throw error;
  }
}
