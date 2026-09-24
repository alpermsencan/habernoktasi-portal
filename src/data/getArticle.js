import newsData from './newsData.json';

export function getArticleById(id) {
  const strId = String(id);

  // 1. Find in headlineSlider
  let found = newsData.headlineSlider.find((item) => String(item.id) === strId);

  // 2. Or in categories
  if (!found) {
    for (const cat of newsData.categories) {
      const art = cat.articles.find((item) => String(item.id) === strId);
      if (art) {
        found = { ...art, category: cat.name, categorySlug: cat.slug, author: art.author || 'X Yazar' };
        break;
      }
    }
  }

  // 3. Or in sicakGundem
  if (!found && newsData.sicakGundem) {
    found = newsData.sicakGundem.find((item) => String(item.id) === strId);
  }

  // 4. Or in sliderSideNews
  if (!found && newsData.sliderSideNews) {
    found = newsData.sliderSideNews.find((item) => String(item.id) === strId);
  }

  // 5. Or in dynamicFeed
  if (!found && newsData.dynamicFeed) {
    found = newsData.dynamicFeed.find((item) => String(item.id) === strId);
  }

  // 6. Or in todayEvents
  if (!found && newsData.todayEvents) {
    found = newsData.todayEvents.find((item) => String(item.id) === strId);
  }

  // 7. Or in mostRead
  if (!found && newsData.mostRead) {
    found = newsData.mostRead.find((item) => String(item.id) === strId);
  }

  // Fallback to slider 1 if not found
  if (!found) {
    found = newsData.headlineSlider[0];
  }

  // Try to find stored article for full text if available
  let fullArticle = null;
  try {
    const storedNews = require('./storedNews.json');
    fullArticle = storedNews.find(
      (item) => String(item.id) === strId || item.title === found.title
    );
  } catch {
    // ignore
  }

  // Get 4 related articles from the same category or other categories
  const categoryArticles = [];
  const currentCat = newsData.categories.find(
    (c) => c.name.toLowerCase() === (found.category || '').toLowerCase()
  ) || newsData.categories[0];

  if (currentCat && currentCat.articles) {
    for (const art of currentCat.articles) {
      if (String(art.id) !== strId) {
        categoryArticles.push({
          id: art.id,
          title: art.title,
          summary: art.summary,
          image: art.image,
          category: currentCat.name,
          date: art.date || 'Bugün'
        });
      }
      if (categoryArticles.length >= 4) break;
    }
  }

  const articleText = (fullArticle?.content || fullArticle?.summary || found.summary || '').trim();

  // Content blocks: ONLY real news paragraph, strictly NO template boilerplates or fake sector quotes
  const contentBlocks = [];
  if (articleText) {
    contentBlocks.push({
      type: "paragraph",
      text: articleText
    });
  }

  return {
    id: found.id,
    title: found.title,
    spot: articleText || `${found.title} gelişmelerine ilişkin ayrıntılar ve tüm bilgiler Haber Noktası sayfalarında.`,
    category: found.category || 'GÜNDEM',
    categorySlug: found.categorySlug || 'gundem',
    publishDate: found.date || 'Bugün',
    updateDate: 'Az önce güncellendi',
    readTime: '2 dakika okuma',
    readCount: found.readCount || found.views || '85.400',
    mainImage: found.image,
    imageCaption: `${found.title} (Fotoğraf: Haber Noktası)`,
    author: {
      name: found.author || 'X Yazar',
      role: 'Haber Merkezi Editörü',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      bio: 'Haber Noktası araştırmacı gazetecilik ve son dakika masası.',
      articleCount: 1850,
      twitter: 'habernoktasi'
    },
    tags: [found.category || 'Gündem', 'Son Dakika', 'Türkiye', 'Haber'],
    content: contentBlocks,
    comments: [
      {
        id: "c1",
        userName: "Vatandaş",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80",
        date: "1 saat önce",
        likes: 12,
        content: "Gelişmeleri yakından takip ediyoruz, net bilgilendirme için teşekkürler."
      }
    ],
    relatedArticles: categoryArticles
  };
}
