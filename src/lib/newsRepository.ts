import fs from 'fs';
import path from 'path';
import { INewsArticle } from '@/types/news';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DB_FILE = path.join(DATA_DIR, 'storedNews.json');

/**
 * Ensures the data storage directory and JSON database file exist
 */
function ensureStorage(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

/**
 * Reads all stored articles from the persistence layer
 */
export async function getAllStoredArticles(): Promise<INewsArticle[]> {
  ensureStorage();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('[NewsRepository Error] Failed to read database:', error);
    return [];
  }
}

/**
 * Checks whether an article already exists by GUID or original Source Link (Deduplication)
 */
export async function articleExists(guid: string, sourceLink: string): Promise<boolean> {
  const articles = await getAllStoredArticles();
  return articles.some(
    (item) =>
      (item.guid && item.guid === guid) ||
      (item.sourceLink && item.sourceLink === sourceLink)
  );
}

/**
 * Saves a new article to the database
 */
export async function saveArticle(article: INewsArticle): Promise<INewsArticle> {
  ensureStorage();
  const articles = await getAllStoredArticles();
  
  // Prepend new article so newest is first
  articles.unshift(article);

  // Keep a maximum of 500 recent RSS articles to maintain optimum performance and disk space
  const trimmed = articles.slice(0, 500);

  fs.writeFileSync(DB_FILE, JSON.stringify(trimmed, null, 2), 'utf8');
  return article;
}

/**
 * Saves multiple articles in batch with deduplication check
 */
export async function saveArticlesBatch(newArticles: INewsArticle[]): Promise<number> {
  ensureStorage();
  const existingArticles = await getAllStoredArticles();
  const existingKeys = new Set(
    existingArticles.flatMap((a) => [a.guid, a.sourceLink].filter(Boolean))
  );

  let insertedCount = 0;
  const toInsert: INewsArticle[] = [];

  for (const art of newArticles) {
    if (!existingKeys.has(art.guid) && !existingKeys.has(art.sourceLink)) {
      toInsert.push(art);
      existingKeys.add(art.guid);
      existingKeys.add(art.sourceLink);
      insertedCount++;
    }
  }

  if (toInsert.length > 0) {
    const combined = [...toInsert, ...existingArticles].slice(0, 500);
    fs.writeFileSync(DB_FILE, JSON.stringify(combined, null, 2), 'utf8');
  }

  return insertedCount;
}

/**
 * Retrieves the latest news for UI display, optionally filtered by category
 */
export async function getLatestNews(limit = 20, category?: string): Promise<INewsArticle[]> {
  const articles = await getAllStoredArticles();
  if (category && category !== 'Tümü' && category !== 'all') {
    return articles
      .filter((a) => a.category.toLowerCase() === category.toLowerCase())
      .slice(0, limit);
  }
  return articles.slice(0, limit);
}

/**
 * Finds a single article by its exact unique slug.
 * Returns null if not found (enables throwing notFound() in Next.js).
 */
export async function findArticleBySlug(slug: string): Promise<INewsArticle | null> {
  if (!slug) return null;
  const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();

  // 1. Search in storedNews.json
  const articles = await getAllStoredArticles();
  let found = articles.find((a) => a.slug && a.slug.toLowerCase() === decodedSlug);
  if (found) return found;

  // 2. Search by matching id or guid
  found = articles.find((a) => String(a.id) === decodedSlug || (a.guid && a.guid === decodedSlug));
  if (found) return found;

  // 3. Fallback search in newsData.json by slug
  try {
    const newsDataFile = path.join(DATA_DIR, 'newsData.json');
    if (fs.existsSync(newsDataFile)) {
      const newsData = JSON.parse(fs.readFileSync(newsDataFile, 'utf8'));

      const allItems: any[] = [
        ...(newsData.headlineSlider || []),
        ...(newsData.sliderSideNews || []),
        ...(newsData.todayEvents || []),
        ...(newsData.sicakGundem || []),
        ...(newsData.categories || []).flatMap((c: any) => c.articles || []),
      ];

      const item = allItems.find((n) => n.slug && n.slug.toLowerCase() === decodedSlug);
      if (item) {
        return {
          id: String(item.id || item.slug),
          guid: item.guid || item.link || item.slug,
          title: item.title,
          slug: item.slug,
          summary: item.summary || item.title,
          content: item.content || item.summary || item.title,
          sourceLink: item.link || item.sourceLink || `https://www.habernoktasi.com.tr/haber/${item.slug}`,
          sourceName: item.sourceName || 'Haber Noktası',
          category: item.category || 'Gündem',
          imageUrl: item.image || item.imageUrl || '/placeholder.webp',
          publishedAt: item.date || item.pubDate || new Date().toISOString(),
          createdAt: new Date().toISOString(),
          isHeadline: !!item.isHeadline,
        };
      }
    }
  } catch (err) {
    console.error('[NewsRepository Error] Failed to search newsData:', err);
  }

  return null;
}

/**
 * Returns all existing slugs for static generation
 */
export async function getAllSlugs(): Promise<string[]> {
  const articles = await getAllStoredArticles();
  const slugSet = new Set<string>();

  for (const art of articles) {
    if (art.slug) slugSet.add(art.slug);
  }

  try {
    const newsDataFile = path.join(DATA_DIR, 'newsData.json');
    if (fs.existsSync(newsDataFile)) {
      const newsData = JSON.parse(fs.readFileSync(newsDataFile, 'utf8'));
      const allItems: any[] = [
        ...(newsData.headlineSlider || []),
        ...(newsData.sliderSideNews || []),
        ...(newsData.todayEvents || []),
        ...(newsData.sicakGundem || []),
        ...(newsData.categories || []).flatMap((c: any) => c.articles || []),
      ];
      for (const item of allItems) {
        if (item.slug) slugSet.add(item.slug);
      }
    }
  } catch (err) {
    // Ignore error in fallback
  }

  return Array.from(slugSet);
}
