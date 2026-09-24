import React from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import newsData from '@/data/newsData.json';
import NewsCard from '@/components/NewsCard';
import Sidebar from '@/components/Sidebar';
import { fetchGoogleNews } from '@/lib/googleNews';

const slugToCategoryMap = {
  gundem: { name: 'Gündem', parent: null, desc: 'Türkiye ve dünya gündemindeki en sıcak gelişmeler, siyaset ve diplomasi.' },
  dunya: { name: 'Dünya', parent: null, desc: 'Uluslararası ilişkiler, küresel barış zirveleri ve sınır ötesi gelişmeler.' },
  ekonomi: { name: 'Ekonomi', parent: null, desc: 'Piyasalar, Borsa İstanbul, döviz, altın, konut ve çalışma hayatı analizleri.' },
  spor: { name: 'Spor', parent: null, desc: 'Süper Lig, derbiler, Avrupa kupaları, transfer haberleri ve canlı skorlar.' },
  kelebek: { name: 'Kelebek (Magazin & Sanat)', parent: null, desc: 'Magazin dünyası, film festivalleri, podyum trendleri ve kültür sanat etkinlikleri.' },
  'kelebek-magazin': { name: 'Kelebek Magazin', parent: null, desc: 'Magazin dünyası, ünlülerin yaşamı, dizi ve televizyon dünyasından en sıcak ve özel haberler.' },
  magazin: { name: 'Magazin', parent: 'Kelebek', desc: 'Dizi dünyası, ünlülerin yaşamı ve özel röportajlar.' },
  moda: { name: 'Moda', parent: 'Kelebek', desc: 'Dünya moda haftaları, sezon trendleri ve tasarımcı koleksiyonları.' },
  'kultur-sanat': { name: 'Kültür & Sanat', parent: 'Kelebek', desc: 'Tiyatro, sinema, sergiler, edebiyat ve konserler.' },
  saglik: { name: 'Sağlık', parent: null, desc: 'Tıp dünyasından son keşifler, koruyucu sağlık ve sağlıklı yaşam rehberi.' },
  beslenme: { name: 'Beslenme', parent: 'Sağlık', desc: 'Akdeniz diyeti, vitamin dengesi ve uzman diyetisyen önerileri.' },
  'koruyucu-saglik': { name: 'Koruyucu Sağlık', parent: 'Sağlık', desc: 'Mevsimsel hastalıklara karşı bağışıklık ve erken teşhis yöntemleri.' },
  'ruh-sagligi': { name: 'Ruh Sağlığı', parent: 'Sağlık', desc: 'Stres yönetimi, zihinsel dinginlik ve psikolojik iyi oluş pratikleri.' },
  teknoloji: { name: 'Teknoloji', parent: null, desc: 'Yapay zeka, otonom araçlar, mobil ve dijital ekosistem.' },
};

export async function generateStaticParams() {
  const slugs = Object.keys(slugToCategoryMap);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const info = slugToCategoryMap[params.slug] || { name: params.slug.toUpperCase() };
  return {
    title: `${info.name} Haberleri - Haber Noktası`,
    description: info.desc || `${info.name} kategorisinde son dakika haberleri ve güncel gelişmeler.`,
  };
}

export default async function CategoryPage({ params }) {
  const info = slugToCategoryMap[params.slug] || {
    name: params.slug.toUpperCase(),
    desc: 'En güncel gelişmeler ve ayrıntılar Haber Noktası sayfalarında.',
  };

  // Find articles matching category from local data
  let localArticles = [];
  const isMagazinMatch = (s) => s === 'kelebek' || s === 'magazin' || s === 'kelebek-magazin';
  const foundCategory = newsData.categories.find(
    (c) =>
      c.slug === params.slug ||
      (isMagazinMatch(params.slug) && isMagazinMatch(c.slug)) ||
      (info.parent && c.name.toLowerCase().includes(info.parent.toLowerCase()))
  );

  if (foundCategory) {
    localArticles = foundCategory.articles;
  } else {
    // fallback to slider
    localArticles = newsData.headlineSlider.map((h) => ({
      id: h.id,
      title: h.title,
      summary: h.summary,
      image: h.image,
      date: h.date,
      views: h.readCount,
    }));
  }

  // Also fetch real-time Google News for this specific category
  const googleNewsItems = await fetchGoogleNews(params.slug, 4);

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Ekmek Kırıntısı" className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4">
        <Link href="/" className="hover:text-hurriyet-red transition flex items-center gap-1 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Ana Sayfa</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        {info.parent && (
          <>
            <span className="text-neutral-500">{info.parent}</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          </>
        )}
        <span className="font-bold text-neutral-800 dark:text-neutral-200 uppercase">
          {info.name}
        </span>
      </nav>

      {/* Category Banner Title */}
      <div className="bg-white dark:bg-slate-900 border border-neutral-200/90 dark:border-slate-800 rounded-xl p-6 sm:p-8 mb-8 shadow-card flex items-center justify-between border-l-8 border-l-hurriyet-red">
        <div>
          <span className="text-xs uppercase font-black text-hurriyet-red tracking-wider">
            HABER NOKTASI KATEGORİ
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#1A1A1A] dark:text-white mt-1">
            {info.name}
          </h1>
          <p className="text-sm text-[#666666] dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            {info.desc}
          </p>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {localArticles.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                category={info.name}
                isFeature={true}
              />
            ))}
          </div>

          {/* Live Google News Section for this Category */}
          {googleNewsItems && googleNewsItems.length > 0 && (
            <div className="mt-10 pt-8 border-t-2 border-neutral-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif font-black text-lg text-neutral-900 dark:text-white uppercase tracking-tight">
                  Google News Canlı Akışı: {info.name}
                </h3>
                <span className="text-xs text-hurriyet-red font-bold">Gerçek Zamanlı</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {googleNewsItems.map((gItem) => (
                  <a
                    key={gItem.id}
                    href={gItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-lg border border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-hurriyet-red hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-bold text-hurriyet-red block mb-1">
                        {gItem.source} • {gItem.date}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#1A1A1A] dark:text-white line-clamp-2 leading-snug">
                        {gItem.title}
                      </h4>
                    </div>
                    <span className="text-[11px] text-neutral-400 mt-2 block">Kaynağa Git →</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
