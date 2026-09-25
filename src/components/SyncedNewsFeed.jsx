'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Newspaper, ExternalLink, RefreshCw, Clock, CheckCircle2 } from 'lucide-react';
import EnsonhaberBanner from '@/components/EnsonhaberBanner';

export default function SyncedNewsFeed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { key: 'all', label: 'Tüm Kaynaklar' },
    { key: 'Gündem', label: 'Gündem' },
    { key: 'Teknoloji', label: 'Teknoloji' },
    { key: 'Ekonomi', label: 'Ekonomi' },
    { key: 'Spor', label: 'Spor' },
  ];

  const fetchSyncedNews = async (cat = 'all') => {
    setLoading(true);
    try {
      const url = cat === 'all' 
        ? '/api/news/synced?limit=6' 
        : `/api/news/synced?category=${encodeURIComponent(cat)}&limit=6`;
      const res = await fetch(url);
      const json = await res.json();
      if (json && json.data) {
        setArticles(json.data);
      }
    } catch (err) {
      console.error('Error fetching synced news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyncedNews(activeCategory);
  }, [activeCategory]);

  return (
    <section className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-300 dark:border-neutral-800 p-4 sm:p-5 shadow-sm my-6" aria-label="Yerel Optimize Edilmiş Canlı RSS Akışı">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-neutral-200 dark:border-neutral-800 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600 text-white shadow-sm">
            <Newspaper className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-[#E31E24] tracking-wider">
                CANLI RSS &amp; WEBP OPTİMİZASYONU
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                <CheckCircle2 className="w-3 h-3" />
                Hostinger Uyumlu
              </span>
            </div>
            <h3 className="font-black text-lg sm:text-xl text-neutral-950 dark:text-white tracking-tight">
              Ajanslardan Anlık Optimize Haberler (TRT, NTV, Sözcü)
            </h3>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className={`px-2.5 py-1 text-xs font-bold rounded transition ${
                activeCategory === c.key
                  ? 'bg-[#E31E24] text-white shadow-sm'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
              }`}
            >
              {c.label}
            </button>
          ))}
          <button
            onClick={() => fetchSyncedNews(activeCategory)}
            disabled={loading}
            className="p-1.5 text-neutral-400 hover:text-red-600 rounded ml-1 transition"
            title="Yenile"
            aria-label="Yenile"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid of articles with downloaded local WebP images */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-8 text-neutral-500 text-xs">
          Henüz senkronize edilmiş haber bulunamadı. Cron senkronizasyonunu tetikleyin.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {articles.map((item) => (
            <a
              key={item.id}
              href={item.sourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850 hover:bg-white dark:hover:bg-neutral-800 hover:border-red-500/70 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Ensonhaber Tarzı Başlık Bannerı */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-1.5 sm:p-2">
                  <EnsonhaberBanner
                    title={item.title}
                    id={item.id}
                    size="sm"
                  />
                </div>
              </div>

              {/* Text Info */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 dark:text-neutral-400 mb-1 font-bold">
                    <Clock className="w-3 h-3 text-red-500" />
                    <span>{new Date(item.publishedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span>{new Date(item.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
                  </div>

                  <h4 className="font-black text-base sm:text-lg text-neutral-950 dark:text-neutral-100 group-hover:text-[#E31E24] transition-colors line-clamp-2 leading-snug tracking-tight mb-1.5">
                    {item.title}
                  </h4>

                  <p className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-[11px] font-black text-[#E31E24]">
                  <span>Kaynağında İncele</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
