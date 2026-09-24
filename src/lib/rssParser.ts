import Parser from 'rss-parser';

export interface EnsonhaberRSSItem {
  guid: string;
  title: string;
  link: string;
  summary: string;
  category: string;
  pubDate: string;
  imageUrl: string | null;
}

interface CustomFeed {
  title: string;
}

interface CustomItem {
  guid?: string;
  title?: string;
  link?: string;
  description?: string;
  category?: string;
  pubDate?: string;
  isoDate?: string;
  mediaContent?: {
    $?: {
      url?: string;
      medium?: string;
      type?: string;
    };
    url?: string;
  };
  'media:content'?: {
    $?: {
      url?: string;
    };
    url?: string;
  };
  enclosure?: {
    url?: string;
    $?: {
      url?: string;
    };
  };
}

/**
 * Configure RSS parser with Yahoo Media namespace (media:content) and enclosure
 */
const parser = new Parser<CustomFeed, CustomItem>({
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
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    Accept: 'application/rss+xml, application/xml, text/xml, */*',
  },
  timeout: 10000,
});

/**
 * Clean CDATA and HTML tags from description text
 */
export function cleanDescription(rawText: string | null | undefined): string {
  if (!rawText) return '';
  return rawText
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
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
 * Extract media:content image URL matching Ensonhaber's exact XML structure:
 * <media:content medium="image" url="https://imgcdn.ensonhaber.com/..." />
 */
export function extractMediaImageUrl(item: CustomItem): string | null {
  // 1. media:content with $ attributes (standard rss-parser XML attribute mapping)
  if (item.mediaContent?.$?.url) {
    return item.mediaContent.$.url.trim();
  }
  if (item.mediaContent?.url) {
    return item.mediaContent.url.trim();
  }

  // 2. Raw 'media:content' object
  if (item['media:content']?.$?.url) {
    return item['media:content'].$.url.trim();
  }
  if (item['media:content']?.url) {
    return item['media:content'].url.trim();
  }

  // 3. Fallback enclosure check
  if (item.enclosure?.url) {
    return item.enclosure.url.trim();
  }
  if (item.enclosure?.$?.url) {
    return item.enclosure.$.url.trim();
  }

  // 4. Regex fallback from description if embedded
  if (item.description) {
    const match = item.description.match(/<img[^>]+src=["'](https?:\/\/[^"'>]+)["']/i);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
}

/**
 * Fetch and parse Ensonhaber RSS feed (https://www.ensonhaber.com/rss/ensonhaber.xml)
 */
export async function parseEnsonhaberRSS(
  feedUrl = 'https://www.ensonhaber.com/rss/ensonhaber.xml'
): Promise<EnsonhaberRSSItem[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    if (!feed || !feed.items) return [];

    return feed.items
      .map((item) => {
        const title = (item.title || '').trim();
        const link = (item.link || '').trim();
        const guid = (item.guid || link || '').trim();
        const summary = cleanDescription(item.description);
        const category = (item.category || 'Gündem').trim();
        const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
        const imageUrl = extractMediaImageUrl(item);

        return {
          guid,
          title,
          link,
          summary,
          category,
          pubDate,
          imageUrl,
        };
      })
      .filter((item) => item.title.length > 0 && item.link.length > 0);
  } catch (error: any) {
    console.error(`[Ensonhaber RSS Error] Failed to fetch feed: ${error.message}`);
    throw error;
  }
}
