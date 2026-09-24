import React from 'react';
import BreakingNewsBar from '@/components/BreakingNewsBar';
import TodayEventsBar from '@/components/TodayEventsBar';
import LiveFinanceSection from '@/components/LiveFinanceSection';
import SicakGundem from '@/components/SicakGundem';
import NewsSlider from '@/components/NewsSlider';
import CategorySection from '@/components/CategorySection';
import DynamicNewsFeed from '@/components/DynamicNewsFeed';
import SyncedNewsFeed from '@/components/SyncedNewsFeed';
import Sidebar from '@/components/Sidebar';
import GoogleNewsStream from '@/components/GoogleNewsStream';
import newsData from '@/data/newsData.json';

export default function HomePage() {
  // Main Categories: Gündem (Siyaset), Ekonomi, Spor (Futbol), Teknoloji
  const primaryCategories = newsData.categories.slice(0, 4);
  // Secondary Categories: Dünya, Kelebek (Kültür & Sanat), Sağlık
  const lifestyleCategories = newsData.categories.slice(4);

  return (
    <>
      {/* 1. Live Breaking News Bar */}
      <BreakingNewsBar />

      {/* 2. Bugün Neler Oldu? Hashtag Ribbon (Son Dakika'nın Hemen Altında) */}
      <TodayEventsBar />

      {/* 3. Main Editorial Portal Layout */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
        {/* Live Markets & Currency Bar (Yarı Yarıya Küçültülmüş Canlı Piyasa) */}
        <LiveFinanceSection />

        {/* Sıcak Gündem: Resim Üzerine Yazı ve Bir Tık Küçültülmüş 3 Resimli Haber */}
        <SicakGundem />

        {/* Headline News Carousel (15 Haberli Slider + Yanında Tam Ölçülü 2 Resimli Haber) */}
        <NewsSlider />

        {/* Main 2-Column Grid: Left Content (8 cols) + Right Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Dense News Flow (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Primary Categories: Gündem (Siyaset) & Ekonomi */}
            <div className="space-y-6">
              {primaryCategories.slice(0, 2).map((category) => (
                <CategorySection key={category.slug} category={category} />
              ))}
            </div>

            {/* Otomatik İndirilen ve Sharp ile WebP'ye Dönüştürülen Canlı Ajans Haberleri (TRT, NTV, Sözcü) */}
            <SyncedNewsFeed />

            {/* Sürekli Aşağıya Doğru Akan Dinamik İçerik Akışı (Infinite Stream & Quick Reader) */}
            <DynamicNewsFeed />

            {/* Other Primary Categories: Spor (Futbol) & Teknoloji */}
            <div className="space-y-6">
              {primaryCategories.slice(2).map((category) => (
                <CategorySection key={category.slug} category={category} />
              ))}
            </div>

            {/* Real-Time Live Google News RSS Stream */}
            <GoogleNewsStream />

            {/* Secondary Categories: Dünya, Kelebek (Magazin & Kültür) & Sağlık */}
            <div className="space-y-6">
              {lifestyleCategories.map((category) => (
                <CategorySection key={category.slug} category={category} />
              ))}
            </div>

          </div>

          {/* Right Column: Dense Packed Sidebar (4 cols) */}
          <div className="lg:col-span-4 sticky top-20">
            <Sidebar />
          </div>
        </div>
      </main>
    </>
  );
}
