'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Eye, 
  Share2, 
  ArrowRight, 
  RefreshCw, 
  BookOpen,
  MessageSquare
} from 'lucide-react';
import newsData from '@/data/newsData.json';

// Additional mock batches to continuously stream down
const extraBatches = [
  {
    id: 907,
    title: "Boğaz Köprüleri ve Otoyollarda Yeni Elektronik Denetim Sistemi Devreye Girdi",
    summary: "Şerit ihlali ve emniyet şeridi suiistimallerini anında tespit eden yapay zeka destekli kameralar 24 saat kayıt yapacak.",
    category: "GÜNDEM",
    image: "https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=600&q=80",
    date: "3 Saat Önce",
    author: "C Yazar"
  },
  {
    id: 908,
    title: "Teknoloji Devi Yeni Nesil Yapay Zeka Çipini Duyurdu: %40 Enerji Tasarrufu",
    summary: "Veri merkezlerinde maliyetleri yarıya indirecek yeni mimari, kuantum hesaplama algoritmalarıyla tam uyumlu çalışıyor.",
    category: "DÜNYA",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    date: "3.5 Saat Önce",
    author: "Y Yazar"
  },
  {
    id: 909,
    title: "Akdeniz'de Yeni Doğalgaz Keşfi: Rezerv Tespit Çalışmaları Hızlandırıldı",
    summary: "Sondaj gemisinin ulaştığı yeni formasyon, bölgedeki enerji dengelerini değiştirecek büyüklükte potansiyele sahip.",
    category: "EKONOMİ",
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80",
    date: "4 Saat Önce",
    author: "X Yazar"
  },
  {
    id: 910,
    title: "Milli Takımda Kadro Revizyonu: Genç Yetenekler İlk Kez Aday Kadroya Çağrıldı",
    summary: "Teknik direktör, Avrupa Şampiyonası elemeleri öncesinde altyapıdan yetişen 3 genç futbolcuya ilk 11 şansı vermeye hazırlanıyor.",
    category: "SPOR",
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80",
    date: "4.5 Saat Önce",
    author: "A Yazar"
  },
  {
    id: 911,
    title: "Akdeniz Tipi Beslenmenin Beyin Sağlığına Etkileri: 10 Yıllık Araştırma Sonuçlandı",
    summary: "Zeytinyağı, ceviz ve yeşil yapraklı sebzelerle beslenen bireylerde hafıza kaybı ve nörodejeneratif riskler %35 oranında daha düşük.",
    category: "SAĞLIK",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80",
    date: "5 Saat Önce",
    author: "D Yazar"
  },
  {
    id: 912,
    title: "Venedik ve Roma Müzeleri Arasında Tarihi İşbirliği: Antik Eserler Türkiye'de Sergilenecek",
    summary: "Kültür ve Turizm Bakanlığı koordinasyonunda hazırlanan dev sergi önümüzdeki ay Atatürk Kültür Merkezi'nde kapılarını açıyor.",
    category: "KELEBEK",
    image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=600&q=80",
    date: "5.5 Saat Önce",
    author: "Z Yazar"
  }
];

export default function DynamicNewsFeed() {
  const [feedItems, setFeedItems] = useState(newsData.dynamicFeed || []);
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const categories = [
    { label: 'Tümü', key: 'all' },
    { label: 'Gündem', key: 'GÜNDEM' },
    { label: 'Ekonomi', key: 'EKONOMİ' },
    { label: 'Spor', key: 'SPOR' },
    { label: 'Sağlık', key: 'SAĞLIK' },
    { label: 'Kelebek', key: 'KELEBEK' },
    { label: 'Dünya', key: 'DÜNYA' }
  ];

  const filteredItems = feedItems.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category.toUpperCase() === activeCategory;
  });

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      // Append extra batch items with fresh timestamps
      const nextBatch = extraBatches.map((item, idx) => ({
        ...item,
        id: item.id + (loadedCount + 1) * 100 + idx,
        date: `${(loadedCount + 1) * 2 + idx + 1} Saat Önce`
      }));
      setFeedItems((prev) => [...prev, ...nextBatch]);
      setLoadedCount((prev) => prev + 1);
      setIsLoadingMore(false);
    }, 600);
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="mb-6" aria-label="Sürekli Dinamik Haber Akışı">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b-2 border-[#E31E24]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 bg-[#E31E24]" />
          <h2 className="font-black text-base sm:text-lg uppercase tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            CANLI HABER AKIŞI
            <span className="text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/80 px-2 py-0.5 rounded tracking-wide">
              {filteredItems.length} HABER
            </span>
          </h2>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full text-xs font-bold scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-2.5 py-1 rounded transition whitespace-nowrap ${
                activeCategory === cat.key
                  ? 'bg-[#E31E24] text-white shadow-sm'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stream of News Items */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-red-500/70 dark:hover:border-red-500/70 transition-all duration-200 overflow-hidden shadow-sm"
            >
              {/* Card Header Content */}
              <div className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
                {/* Thumbnail Image */}
                <div 
                  className="relative w-full sm:w-44 h-32 sm:h-28 shrink-0 rounded overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer"
                  onClick={() => toggleExpand(item.id)}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 180px"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 left-1.5">
                    <span className="bg-[#E31E24] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-red-500" />
                      {item.date}
                    </span>
                    <span>•</span>
                    <span>Yazar: <strong className="text-neutral-800 dark:text-neutral-200">{item.author}</strong></span>
                  </div>

                  <h3 
                    onClick={() => toggleExpand(item.id)}
                    className="font-black text-lg sm:text-xl text-neutral-950 dark:text-neutral-50 hover:text-[#E31E24] cursor-pointer transition-colors leading-snug tracking-tight mb-2"
                  >
                    {item.title}
                  </h3>

                  <p className="text-sm sm:text-base font-bold text-neutral-800 dark:text-neutral-200 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-xs">
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="inline-flex items-center gap-1 text-[#E31E24] hover:text-red-700 font-bold transition"
                    >
                      {isExpanded ? (
                        <>
                          <span>Özeti Kapat</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <span>Hızlı Oku & Detaylar</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/haber/${item.id}`}
                        className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-semibold flex items-center gap-1"
                      >
                        <span>Sayfaya Git</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Downward Expanded Content Drawer (Tıklandığında açılan içerik) */}
              {isExpanded && (
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 border-t border-neutral-200 dark:border-neutral-800 animate-fade-in text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 space-y-3">
                  <div className="p-3 bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700">
                    <h4 className="font-bold text-neutral-900 dark:text-white mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                      <BookOpen className="w-3.5 h-3.5 text-[#E31E24]" />
                      Haberin Detay Özeti ve Öne Çıkanlar
                    </h4>
                    <p className="leading-relaxed mb-2 font-normal">
                      {item.summary} Konuyla ilgili yetkililerden yapılan açıklamalara göre, kamuoyu bilgilendirme süreci devam ederken teknik ekiplerin sahadaki incelemeleri de sürüyor.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400 text-xs">
                      <li>Gelişmeler anlık olarak haber merkezimize ulaşmaktadır.</li>
                      <li>Uzmanlar konunun sektörel ve toplumsal etkilerini değerlendirmektedir.</li>
                      <li>Resmi raporların önümüzdeki saatlerde kamuoyuna duyurulması bekleniyor.</li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    <span className="text-neutral-500">
                      Kaynak: <strong>Haber Noktası Muhabir Ağı</strong>
                    </span>
                    <Link
                      href={`/haber/${item.id}`}
                      className="bg-[#E31E24] hover:bg-[#B71015] text-white px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5"
                    >
                      <span>Haberin Tamamını ve Yorumları Oku</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Load More Button (Daha Fazla Haber Yükle) */}
      <div className="mt-4 text-center">
        <button
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-neutral-800 hover:bg-[#E31E24] dark:hover:bg-[#E31E24] text-white font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-lg shadow transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingMore ? 'animate-spin' : ''}`} />
          <span>{isLoadingMore ? 'Yeni Haberler Getiriliyor...' : 'Daha Fazla İçerik Yükle (Aşağıya Doğru Akış)'}</span>
        </button>
      </div>
    </section>
  );
}
