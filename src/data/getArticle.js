import newsData from './newsData.json';
import articleDetails from './articleDetails.json';

export function getArticleById(id) {
  const strId = String(id);
  if (articleDetails[strId]) {
    return articleDetails[strId];
  }

  // Find in headlineSlider
  let found = newsData.headlineSlider.find((item) => String(item.id) === strId);

  // Or in categories
  if (!found) {
    for (const cat of newsData.categories) {
      const art = cat.articles.find((item) => String(item.id) === strId);
      if (art) {
        found = { ...art, category: cat.name, categorySlug: cat.slug, author: 'Haber Noktası Haber Merkezi' };
        break;
      }
    }
  }

  // Or in sicakGundem
  if (!found && newsData.sicakGundem) {
    found = newsData.sicakGundem.find((item) => String(item.id) === strId);
  }

  // Or in sliderSideNews
  if (!found && newsData.sliderSideNews) {
    found = newsData.sliderSideNews.find((item) => String(item.id) === strId);
  }

  // Or in dynamicFeed
  if (!found && newsData.dynamicFeed) {
    found = newsData.dynamicFeed.find((item) => String(item.id) === strId);
  }

  // Or in todayEvents
  if (!found && newsData.todayEvents) {
    found = newsData.todayEvents.find((item) => String(item.id) === strId);
  }

  // Or in mostRead
  if (!found && newsData.mostRead) {
    found = newsData.mostRead.find((item) => String(item.id) === strId);
  }

  // Fallback to slider 1 if not found
  if (!found) {
    found = newsData.headlineSlider[0];
  }

  // Get 4 related articles from the same category or other categories
  const categoryArticles = [];
  const currentCat = newsData.categories.find(
    (c) => c.name.toLowerCase() === (found.category || '').toLowerCase()
  ) || newsData.categories[0];

  for (const art of currentCat.articles) {
    if (String(art.id) !== strId) {
      categoryArticles.push({
        id: art.id,
        title: art.title,
        summary: art.summary,
        image: art.image,
        category: currentCat.name,
        date: art.date
      });
    }
    if (categoryArticles.length >= 4) break;
  }

  return {
    id: found.id,
    title: found.title,
    spot: found.summary || 'Son dakika gelişmesinin tüm ayrıntıları, perde arkası ve uzman görüşleri Haber Noktası sayfalarında.',
    category: found.category || 'GÜNDEM',
    categorySlug: found.categorySlug || 'gundem',
    publishDate: found.date || 'Bugün',
    updateDate: '15 dakika önce güncellendi',
    readTime: '3 dakika okuma',
    readCount: found.readCount || found.views || '85.400',
    mainImage: found.image,
    imageCaption: `${found.title} konusunda sıcak gelişmeler takip ediliyor. (Fotoğraf: Haber Noktası Arşiv)`,
    author: {
      name: found.author || 'Sedat Ergin',
      role: 'Köşe Yazarı & Kıdemli Muhabir',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      bio: 'Gazeteci, yazar ve dış politika analisti. Yıllardır Haber Noktası bünyesinde köşe yazarlığı ve araştırmacı gazetecilik faaliyetlerini sürdürmektedir.',
      articleCount: 1940,
      twitter: 'habernoktasi'
    },
    tags: [found.category || 'Gündem', 'Son Dakika', 'Türkiye', 'Haber'],
    content: [
      {
        "type": "paragraph",
        "text": `${found.title} başlığı altında kamuoyuna yansıyan son gelişmeler, yetkili kurumların koordinasyonunda hızla hayata geçiriliyor. Konuya ilişkin hazırlanan kapsamlı değerlendirme raporu kamuoyu ile paylaşıldı.`
      },
      {
        "type": "highlight",
        "text": `${found.summary || 'Atılan adımlarla birlikte sürecin tüm taraflar için kazan-kazan prensibi doğrultusunda ilerlemesi hedefleniyor.'}`
      },
      {
        "type": "paragraph",
        "text": "Uzmanlar tarafından yapılan değerlendirmelerde, uygulamanın orta ve uzun vadeli sonuçlarının hem sektörel bazda hem de genel piyasa dengelerinde önemli bir rahatlama sağlayacağı ifade ediliyor."
      },
      {
        "type": "heading",
        "text": "Önümüzdeki Süreçte Neler Bekleniyor?"
      },
      {
        "type": "paragraph",
        "text": "İlgili bakanlık ve sivil toplum kuruluşları temsilcilerinin katılımıyla gerçekleştirilecek genişletilmiş istişare toplantısında, uygulama takviminin detayları masaya yatırılacak."
      },
      {
        "type": "quote",
        "author": "Sektör Temsilcisi",
        "text": "Gelişmeleri dikkatle takip ediyoruz. Kararın sahaya ve vatandaşlarımızın günlük yaşamına yansımalarını adım adım değerlendireceğiz."
      },
      {
        "type": "paragraph",
        "text": "Süreç hakkındaki tüm gelişmeler ve resmi tebliğler Haber Noktası üzerinden anlık olarak aktarılmaya devam edecek."
      }
    ],
    comments: [
      {
        "id": "c1",
        "userName": "Caner Doğan",
        "userAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80",
        "date": "1 saat önce",
        "likes": 24,
        "content": "Çok yerinde ve aydınlatıcı bir haber olmuş. Sürecin hızla tamamlanmasını bekliyoruz."
      },
      {
        "id": "c2",
        "userName": "Zeynep Kaya",
        "userAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
        "date": "45 dakika önce",
        "likes": 12,
        "content": "Detayları madde madde vermeniz çok iyi olmuş, emeği geçen herkese teşekkürler."
      }
    ],
    relatedArticles: categoryArticles
  };
}
