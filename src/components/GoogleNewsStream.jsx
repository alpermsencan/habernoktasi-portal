'use client';

import React, { useEffect, useState } from 'react';
import { Radio, ExternalLink, RefreshCw, Clock } from 'lucide-react';

export default function GoogleNewsStream() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { key: 'all', label: 'Tüm Haberler' },
    { key: 'gundem', label: 'Gündem' },
    { key: 'ekonomi', label: 'Ekonomi' },
    { key: 'spor', label: 'Spor' },
    { key: 'kelebek', label: 'Magazin & Kültür' },
    { key: 'saglik', label: 'Sağlık' },
  ];

  const fetchStream = async (cat = 'all') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/google-news?category=${cat}&limit=6`);
      const data = await res.json();
      if (data && data.data) {
        setNews(data.data);
      }
    } catch (err) {
      console.error('Google News stream error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStream(activeCategory);
  }, [activeCategory]);

  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl border border-neutral-200/90 dark:border-slate-800 p-5 shadow-card my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-4 border-b border-neutral-200 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/40 text-hurriyet-red">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-hurriyet-red tracking-wider">
                CANLI ENTEGRASYON
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <h3 className="font-serif font-black text-lg sm:text-xl text-[#1A1A1A] dark:text-white">
              Google News Türkiye Canlı Akışı
            </h3>
          </div>
        </div>

        {/* Category Pills & Refresh */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                activeCategory === c.key
                  ? 'bg-hurriyet-red text-white'
                  : 'bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-300 hover:bg-neutral-200'
              }`}
            >
              {c.label}
            </button>
          ))}
          <button
            onClick={() => fetchStream(activeCategory)}
            disabled={loading}
            className="p-1.5 text-neutral-400 hover:text-hurriyet-red rounded ml-1 transition"
            title="Yenile"
            aria-label="Yenile"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid of Google News Live Items */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 bg-neutral-100 dark:bg-slate-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3.5 rounded-lg border border-neutral-100 dark:border-slate-800 bg-neutral-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-hurriyet-red/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1.5 font-medium">
                  <span className="font-bold text-hurriyet-red">{item.source}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm text-[#1A1A1A] dark:text-neutral-100 group-hover:text-hurriyet-red transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-neutral-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-neutral-500 group-hover:text-hurriyet-red">
                <span>Habere Git</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
