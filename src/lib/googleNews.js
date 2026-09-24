// Helper to fetch and parse real-time Turkish news from Google News RSS feeds

const categoryQueries = {
  gundem: 'https://news.google.com/rss/headlines/section/topic/NATION?hl=tr&gl=TR&ceid=TR:tr',
  dunya: 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=tr&gl=TR&ceid=TR:tr',
  ekonomi: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=tr&gl=TR&ceid=TR:tr',
  spor: 'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=tr&gl=TR&ceid=TR:tr',
  teknoloji: 'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=tr&gl=TR&ceid=TR:tr',
  magazin: 'https://news.google.com/rss/search?q=magazin+kultur+sanat&hl=tr&gl=TR&ceid=TR:tr',
  kelebek: 'https://news.google.com/rss/search?q=magazin+moda+sanat&hl=tr&gl=TR&ceid=TR:tr',
  saglik: 'https://news.google.com/rss/search?q=saglik+beslenme+tip&hl=tr&gl=TR&ceid=TR:tr',
  all: 'https://news.google.com/rss?hl=tr&gl=TR&ceid=TR:tr',
};

const categoryDefaultImages = {
  gundem: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80',
  dunya: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
  ekonomi: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
  spor: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
  teknoloji: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
  kelebek: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
  saglik: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
  all: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
};

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

export async function fetchGoogleNews(category = 'all', limit = 10) {
  try {
    const url = categoryQueries[category.toLowerCase()] || categoryQueries.all;
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HaberNoktasiBot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Google News RSS failed: ${response.status}`);
    }

    const xml = await response.text();
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < limit) {
      const itemContent = match[1];

      const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(itemContent);
      const linkMatch = /<link>([\s\S]*?)<\/link>/.exec(itemContent);
      const pubDateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(itemContent);
      const sourceMatch = /<source[^>]*>([\s\S]*?)<\/source>/.exec(itemContent);
      const descMatch = /<description>([\s\S]*?)<\/description>/.exec(itemContent);

      let fullTitle = titleMatch ? cleanText(titleMatch[1]) : '';
      let sourceName = sourceMatch ? cleanText(sourceMatch[1]) : 'Haber Noktası';

      // Remove source from end of title (e.g. "Başlık - Sözcü Gazetesi" -> "Başlık")
      if (sourceName && fullTitle.includes(` - ${sourceName}`)) {
        fullTitle = fullTitle.replace(` - ${sourceName}`, '');
      }

      const rawDate = pubDateMatch ? pubDateMatch[1] : new Date().toISOString();
      const formattedDate = new Date(rawDate).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      });

      items.push({
        id: `gn-${items.length + 1}-${Date.now()}`,
        title: fullTitle,
        summary: descMatch ? cleanText(descMatch[1]).slice(0, 160) + '...' : '',
        url: linkMatch ? linkMatch[1].trim() : '#',
        source: sourceName,
        date: formattedDate,
        category: category.toUpperCase(),
        image: categoryDefaultImages[category.toLowerCase()] || categoryDefaultImages.all,
      });
    }

    return items;
  } catch (error) {
    console.error('[Google News RSS Fetch Error]:', error.message);
    return [];
  }
}
