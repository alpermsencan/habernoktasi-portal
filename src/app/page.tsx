import React from 'react';
import BreakingNewsBar from '@/components/BreakingNewsBar';
import TodayEventsBar from '@/components/TodayEventsBar';
import LiveFinanceSection from '@/components/LiveFinanceSection';
import HeadlineSlider from '@/components/HeadlineSlider';
import CategorySection from '@/components/CategorySection';
import DynamicNewsFeed from '@/components/DynamicNewsFeed';
import SyncedNewsFeed from '@/components/SyncedNewsFeed';
import Sidebar from '@/components/Sidebar';
import GoogleNewsStream from '@/components/GoogleNewsStream';
import newsData from '@/data/newsData.json';

interface CategoryItem {
  name: string;
  slug: string;
  description?: string;
  articles: Array<{
    id: number | string;
    title: string;
    summary: string;
    category: string;
    image: string;
    date?: string;
    time?: string;
    views?: string;
    author?: string;
  }>;
}

export default function HomePage() {
  const categories: CategoryItem[] = newsData.categories || [];

  // Filter primary categories as requested: Gündem, Spor, Ekonomi, Teknoloji, Dünya
  const gundemCat = categories.find((c) => c.slug === 'gundem') || categories[0];
  const sporCat = categories.find((c) => c.slug === 'spor') || categories[2];
  const ekonomiCat = categories.find((c) => c.slug === 'ekonomi') || categories[1];
  const teknolojiCat = categories.find((c) => c.slug === 'teknoloji') || categories[3];
  const dunyaCat = categories.find((c) => c.slug === 'dunya') || categories[4];
  const otherCats = categories.filter(
    (c) => !['gundem', 'spor', 'ekonomi', 'teknoloji', 'dunya'].includes(c.slug)
  );

  return (
    <>
      {/* 1. En Üst Bant - Son Dakika (Breaking News Bar) */}
      <BreakingNewsBar />

      {/* Bugün Neler Oldu? Hashtag Şeridi */}
      <TodayEventsBar />

      {/* Ana Gövde Düzeni */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-4 py-2 sm:py-3 space-y-4 sm:space-y-6">
        {/* Canlı Piyasalar (Dolar, Euro, Altın, BIST) */}
        <LiveFinanceSection />

        {/* 2. Ana Bölüm (Grid 12 Kolon):
            - Sol / Merkez (8 Kolon): Manşet Slider (Headline Slider)
            - Sağ (4 Kolon): Sıcak Gündem (Trending / Side Feed: 5-6 güncel haber) */}
        <HeadlineSlider />

        {/* 3. Alt Kategori Blokları (Gündem, Spor, Ekonomi, Dünya, Teknoloji - 4'lü kart ızgarası) */}
        <div className="space-y-6 sm:space-y-8">
          {/* Gündem Kategorisi (4'lü Kart Izgarası) */}
          {gundemCat && <CategorySection category={gundemCat} />}

          {/* Spor Kategorisi (4'lü Kart Izgarası) */}
          {sporCat && <CategorySection category={sporCat} />}

          {/* İki Kolonlu Alt Düzen: Sol (8 Kolon) Kategori Akışı + Sağ (4 Kolon) Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Sol 8 Kolon: Diğer Kategoriler ve Dinamik Akış */}
            <div className="lg:col-span-8 space-y-8">
              {/* Ekonomi Kategorisi (4'lü Kart Izgarası) */}
              {ekonomiCat && <CategorySection category={ekonomiCat} />}

              {/* Canlı Ajans Haberleri (TRT, NTV, Sözcü vb.) */}
              <SyncedNewsFeed />

              {/* Teknoloji Kategorisi (4'lü Kart Izgarası) */}
              {teknolojiCat && <CategorySection category={teknolojiCat} />}

              {/* Dünya Kategorisi (4'lü Kart Izgarası) */}
              {dunyaCat && <CategorySection category={dunyaCat} />}

              {/* Sonsuz Dinamik Haber Akışı */}
              <DynamicNewsFeed />

              {/* Google News Akışı */}
              <GoogleNewsStream />

              {/* Diğer Kategoriler (Kelebek, Sağlık) */}
              {otherCats.map((cat) => (
                <CategorySection key={cat.slug} category={cat} />
              ))}
            </div>

            {/* Sağ 4 Kolon: Çok Okunanlar, Yazarlar ve Hava Durumu Sidebar */}
            <div className="lg:col-span-4 sticky top-20">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
