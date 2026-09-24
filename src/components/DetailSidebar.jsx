'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, ExternalLink, Bookmark } from 'lucide-react';
import newsData from '@/data/newsData.json';

export default function DetailSidebar() {
  const [activeTab, setActiveTab] = useState('bugun');

  return (
    <aside className="space-y-6" aria-label="Detay Sayfası Yan Menü">
      {/* 1. 300x250 Reklam Alanı (Üst Pozisyon) */}
      <div className="flex flex-col items-center">
        <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-1.5">
          — REKLAM ALANI (300x250) —
        </span>
        <div className="w-[300px] h-[250px] rounded-xl overflow-hidden relative shadow-md bg-gradient-to-br from-neutral-900 via-neutral-800 to-red-950 p-5 text-white flex flex-col justify-between border border-neutral-700/50 group cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded tracking-wider uppercase backdrop-blur-sm">
              Sponsorlu İçerik
            </span>
            <ExternalLink className="w-4 h-4 text-white/70 group-hover:text-white" />
          </div>

          <div className="my-auto py-2">
            <div className="text-hurriyet-red font-black text-xs uppercase tracking-widest mb-1">
              YATIRIM VE BİRİKİM
            </div>
            <h4 className="font-extrabold text-base leading-tight group-hover:text-red-300 transition">
              Altın ve Dövizde Güvenli Liman: Dijital Hesap Kolaylığı.
            </h4>
            <p className="text-xs text-neutral-300 mt-1 line-clamp-2">
              %0 komisyon avantajıyla anında alım-satım yapın.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-[11px] font-semibold text-neutral-400">banka.com.tr</span>
            <button className="px-3 py-1 bg-hurriyet-red hover:bg-hurriyet-darkRed text-white text-xs font-bold rounded shadow transition">
              İncele
            </button>
          </div>
        </div>
      </div>

      {/* 2. En Çok Okunan Haberler */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-hurriyet-red" />
            <h3 className="font-extrabold text-sm uppercase text-neutral-900 dark:text-white tracking-wide">
              EN ÇOK OKUNANLAR
            </h3>
          </div>
          <div className="flex items-center text-[11px] bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-md">
            <button
              onClick={() => setActiveTab('bugun')}
              className={`px-2 py-0.5 rounded font-semibold transition ${
                activeTab === 'bugun'
                  ? 'bg-hurriyet-red text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Bugün
            </button>
            <button
              onClick={() => setActiveTab('hafta')}
              className={`px-2 py-0.5 rounded font-semibold transition ${
                activeTab === 'hafta'
                  ? 'bg-hurriyet-red text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Bu Hafta
            </button>
          </div>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {newsData.mostRead.map((item) => (
            <Link
              key={item.id}
              href={`/haber/${item.id}`}
              className="flex items-center gap-3 py-3 group first:pt-0 last:pb-0"
            >
              {/* Image thumbnail with rank badge */}
              <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-800 shadow-xs">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                    <span className="text-xs text-neutral-400 font-bold">HN</span>
                  </div>
                )}
                <span
                  className={`absolute top-1 left-1 w-5 h-5 rounded flex items-center justify-center text-[10px] font-black shadow-md ${
                    item.rank === 1
                      ? 'bg-hurriyet-red text-white'
                      : item.rank === 2
                      ? 'bg-neutral-900 text-white dark:bg-neutral-800'
                      : 'bg-black/75 backdrop-blur-xs text-white'
                  }`}
                >
                  {item.rank}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black text-hurriyet-red uppercase tracking-wider block mb-0.5">
                  {item.category}
                </span>
                <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-neutral-100 group-hover:text-hurriyet-red transition line-clamp-2 leading-snug">
                  {item.title}
                </h4>
                <div className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 mt-1 flex items-center justify-between">
                  <span>{item.views} okunma</span>
                  <span>{item.time}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Editörün Seçtikleri */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-neutral-200 dark:border-neutral-800">
          <Bookmark className="w-4 h-4 text-hurriyet-red" />
          <h3 className="font-extrabold text-sm uppercase text-neutral-900 dark:text-white tracking-wide">
            EDİTÖRÜN SEÇTİKLERİ
          </h3>
        </div>

        <div className="space-y-3">
          {newsData.editorsPicks.map((pick) => (
            <Link
              key={pick.id}
              href={`/haber/${pick.id}`}
              className="flex items-center gap-3 group p-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition"
            >
              <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-800">
                <Image
                  src={pick.image}
                  alt={pick.title}
                  fill
                  sizes="64px"
                  className="object-cover group-hover:scale-105 transition"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-hurriyet-red uppercase">
                  {pick.category}
                </span>
                <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-hurriyet-red transition line-clamp-2 leading-snug">
                  {pick.title}
                </h4>
                <span className="text-[10px] text-neutral-400 mt-0.5 block">
                  {pick.readTime}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
