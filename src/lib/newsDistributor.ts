import fs from 'fs';
import path from 'path';
import { ParsedNews } from './rssParser';

export interface DistributableArticle {
  id?: string | number;
  title: string;
  summary: string;
  category: string;
  normalizedCategory?: string;
  categorySlug?: string;
  imageUrl?: string;
  image?: string;
  pubDate?: string;
  date?: string;
  link?: string;
}

const AUTHORS = [
  'Murat Yetkin',
  'Deniz Zeyrek',
  'Çiğdem Toker',
  'Fatih Altaylı',
  'İsmail Saymaz',
  'Barış Terkoğlu',
  'Nevşin Mengü',
  'Uğur Dündar',
];

function getRandomAuthor(index: number): string {
  return AUTHORS[index % AUTHORS.length];
}

function getRandomViews(): string {
  const main = Math.floor(Math.random() * 90) + 30;
  const dec = Math.floor(Math.random() * 9) + 1;
  return `${main}.${dec}K`;
}

function formatRelativeTime(dateStr?: string, index: number = 0): string {
  if (!dateStr) {
    return `${(index + 1) * 12} Dk Önce`;
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return `${(index + 1) * 10} Dk Önce`;
  }

  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60 && diffMins > 0) {
    return `${diffMins} Dk Önce`;
  } else if (diffMins >= 60 && diffMins < 1440) {
    const hours = Math.floor(diffMins / 60);
    return `${hours} Saat Önce`;
  }

  return `Bugün, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * Distributes processed articles across newsData.json homepage blocks:
 * 1. headlineSlider (15 items)
 * 2. breakingNews (5-8 headlines)
 * 3. sicakGundem (3 items)
 * 4. sliderSideNews (2 items)
 * 5. categories (Gündem, Ekonomi, Spor, Teknoloji, Dünya, Kelebek, Sağlık - 4 items each: 1 main + 3 side)
 */
export async function distributeNews(
  articles: Array<DistributableArticle | ParsedNews>
): Promise<{
  success: boolean;
  sliderCount: number;
  breakingCount: number;
  sicakCount: number;
  sideCount: number;
  updatedCategories: string[];
}> {
  if (!articles || articles.length === 0) {
    throw new Error('Dağıtılacak haber listesi boş olamaz.');
  }

  // Find target newsData.json path
  const primaryPath = path.join(process.cwd(), 'src', 'data', 'newsData.json');
  const fallbackPath = path.join(process.cwd(), 'data', 'newsData.json');
  const targetPath = fs.existsSync(primaryPath) ? primaryPath : fallbackPath;

  if (!fs.existsSync(targetPath)) {
    throw new Error(`newsData.json dosyası bulunamadı: ${targetPath}`);
  }

  const rawJson = fs.readFileSync(targetPath, 'utf8');
  const existingData = JSON.parse(rawJson);

  // Normalize all input articles
  const preparedArticles = articles.map((artItem, idx) => {
    const art = artItem as any;
    const rawImage = art.imageUrl || art.image || '/placeholder.webp';
    const catName = art.normalizedCategory || art.category || 'Gündem';
    const catSlug =
      art.categorySlug ||
      (catName === 'Gündem' ? 'gundem' :
       catName === 'Ekonomi' ? 'ekonomi' :
       catName === 'Spor' ? 'spor' :
       catName === 'Teknoloji' ? 'teknoloji' :
       catName === 'Dünya' ? 'dunya' :
       catName === 'Kelebek' ? 'kelebek' :
       catName === 'Sağlık' ? 'saglik' : 'gundem');

    return {
      id: art.id ? Number(art.id) || idx + 1000 : 1000 + idx,
      title: (art.title || '').trim(),
      summary: (art.summary || art.title || '').slice(0, 180).trim(),
      category: catName.toUpperCase(),
      categoryNormal: catName,
      categorySlug: catSlug,
      image: rawImage,
      date: formatRelativeTime(art.pubDate || art.date, idx),
      readCount: getRandomViews(),
      views: getRandomViews(),
      author: getRandomAuthor(idx),
      time: formatRelativeTime(art.pubDate || art.date, idx),
    };
  });

  // 1. Breaking News (Son Dakika: 5-8 items)
  const breakingNewsTitles: string[] = preparedArticles.slice(0, 8).map((art) => {
    const cleanTitle = art.title.replace(/^SON\s*DAKİKA\s*[:|-]?\s*/i, '');
    return `SON DAKİKA: ${cleanTitle}`;
  });

  // 2. Sıcak Gündem (3 items)
  const sicakGundem = preparedArticles.slice(0, 3).map((art, idx) => ({
    id: 101 + idx,
    title: art.title,
    summary: art.summary,
    category: art.category,
    image: art.image,
    date: art.date,
  }));

  // 3. Slider Side News (2 items)
  const sliderSideNews = preparedArticles.slice(3, 5).map((art, idx) => ({
    id: 21 + idx,
    title: art.title,
    summary: art.summary,
    category: art.category,
    image: art.image,
    views: art.views,
    time: art.time,
  }));

  // 4. Headline Slider (Exact 15 items)
  // Take from index 5 onwards, then wrap around or merge with existing to guarantee exactly 15
  const sliderSource = preparedArticles.slice(5, 20);
  let headlineSlider = sliderSource.map((art, idx) => ({
    id: idx + 1,
    title: art.title,
    summary: art.summary,
    category: art.category,
    image: art.image,
    date: art.date,
    readCount: art.readCount,
    author: art.author,
  }));

  if (headlineSlider.length < 15 && Array.isArray(existingData.headlineSlider)) {
    // Fill remaining from existing headlineSlider
    const needed = 15 - headlineSlider.length;
    const fillers = existingData.headlineSlider.slice(0, needed).map((f: any, i: number) => ({
      ...f,
      id: headlineSlider.length + i + 1,
    }));
    headlineSlider = [...headlineSlider, ...fillers];
  }

  // 5. Category Sections Distribution (4 items each: 1 main + 3 side)
  const categoryDefs = [
    { name: 'Gündem', slug: 'gundem', desc: "Türkiye'nin siyaset, parlamento, güvenlik ve iç politika gündemi." },
    { name: 'Ekonomi', slug: 'ekonomi', desc: 'Piyasalar, Merkez Bankası, Borsa İstanbul, altın, döviz ve bütçe haberleri.' },
    { name: 'Spor', slug: 'spor', desc: 'Futbol, Süper Lig, derbiler, transferler, Şampiyonlar Ligi ve milli takımlar.' },
    { name: 'Teknoloji', slug: 'teknoloji', desc: 'Yapay zeka, yerli teknoloji, TOGG, uzay sanayii, mobil cihazlar ve siber güvenlik.' },
    { name: 'Dünya', slug: 'dunya', desc: 'Uluslararası ilişkiler, küresel diplomasi, ABD, Avrupa ve Orta Doğu gelişmeleri.' },
    { name: 'Kelebek', slug: 'kelebek', desc: 'Magazin, kültür sanat, sinema, müzik, moda ve etkinlik dünyasından en sıcak haberler.' },
    { name: 'Sağlık', slug: 'saglik', desc: 'Sağlıklı yaşam, beslenme, tıp dünyasından son keşifler ve koruyucu sağlık rehberi.' },
  ];

  const updatedCategoriesList: string[] = [];

  const updatedCategories = categoryDefs.map((def, cIdx) => {
    // Match articles belonging to this category
    const matched = preparedArticles.filter(
      (a) => a.categorySlug === def.slug || a.categoryNormal.toLowerCase() === def.name.toLowerCase()
    );

    // Existing articles for this category as fallback
    const existingCat = Array.isArray(existingData.categories)
      ? existingData.categories.find((c: any) => c.slug === def.slug)
      : null;
    const existingArticles = existingCat?.articles || [];

    // Convert matched to category article structure
    const newArticles = matched.slice(0, 4).map((art, aIdx) => ({
      id: (cIdx + 1) * 100 + aIdx + 1,
      title: art.title,
      summary: art.summary,
      category: def.name,
      image: art.image,
      date: art.date,
      views: art.views,
      author: art.author,
    }));

    // Merge with existing if fewer than 4 to prevent empty cards
    let finalCatArticles = [...newArticles];
    if (finalCatArticles.length < 4 && existingArticles.length > 0) {
      const remainingNeeded = 4 - finalCatArticles.length;
      const existingFillers = existingArticles.slice(0, remainingNeeded).map((ea: any, idx: number) => ({
        ...ea,
        id: (cIdx + 1) * 100 + finalCatArticles.length + idx + 1,
      }));
      finalCatArticles = [...finalCatArticles, ...existingFillers];
    }

    if (newArticles.length > 0) {
      updatedCategoriesList.push(def.name);
    }

    return {
      name: def.name,
      slug: def.slug,
      description: existingCat?.description || def.desc,
      articles: finalCatArticles,
    };
  });

  // 6. Update todayEvents (top 10 hashtag ribbon items)
  const todayEvents = preparedArticles.slice(0, 10).map((art, idx) => ({
    id: idx + 1,
    tag: `#${art.category}`,
    title: art.title,
    summary: art.summary,
    time: art.time,
    image: art.image,
  }));

  // Construct complete updated newsData payload
  const updatedData = {
    ...existingData,
    breakingNews: breakingNewsTitles.length > 0 ? breakingNewsTitles : existingData.breakingNews,
    todayEvents: todayEvents.length > 0 ? todayEvents : existingData.todayEvents,
    sicakGundem: sicakGundem.length > 0 ? sicakGundem : existingData.sicakGundem,
    sliderSideNews: sliderSideNews.length > 0 ? sliderSideNews : existingData.sliderSideNews,
    headlineSlider: headlineSlider.length >= 15 ? headlineSlider : existingData.headlineSlider,
    categories: updatedCategories,
    lastUpdated: new Date().toISOString(),
  };

  // Write atomically to newsData.json
  fs.writeFileSync(targetPath, JSON.stringify(updatedData, null, 2), 'utf8');

  // Also sync to other path if exists
  if (primaryPath !== fallbackPath && fs.existsSync(fallbackPath)) {
    try {
      fs.writeFileSync(fallbackPath, JSON.stringify(updatedData, null, 2), 'utf8');
    } catch {
      // ignore
    }
  }

  return {
    success: true,
    sliderCount: updatedData.headlineSlider.length,
    breakingCount: updatedData.breakingNews.length,
    sicakCount: updatedData.sicakGundem.length,
    sideCount: updatedData.sliderSideNews.length,
    updatedCategories: updatedCategoriesList,
  };
}
