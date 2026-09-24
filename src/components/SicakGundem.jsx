'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, Clock } from 'lucide-react';
import newsData from '@/data/newsData.json';

export default function SicakGundem() {
  const items = newsData.sicakGundem || [];

  return (
    <section className="mb-3.5" aria-label="Sıcak Gündem">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-1.5 mb-2 border-b-2 border-[#E31E24]">
        <div className="flex items-center gap-2">
          <div className="bg-[#E31E24] text-white p-1 rounded">
            <Flame className="w-3.5 h-3.5 fill-white animate-pulse" />
          </div>
          <h2 className="font-black text-sm sm:text-base uppercase tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            SICAK GÜNDEM
            <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/80 px-2 py-0.2 rounded uppercase tracking-wider hidden sm:inline">
              CANLI GELİŞMELER
            </span>
          </h2>
        </div>
        <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
          Son Dakika Masası
        </span>
      </div>

      {/* 3 Photo Cards with Text Directly on Image (Göz Alıcı Başlıklar ve Kalın Metinler) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {items.map((item) => (
          <Link
            key={item.slug || item.id}
            href={`/haber/${item.slug || item.id}`}
            className="group relative h-44 sm:h-48 rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-800 hover:border-red-500 dark:hover:border-red-500 shadow-sm hover:shadow-md transition-all duration-300 block"
          >
            {/* Background Image */}
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />

            {/* High Contrast Gradient Overlay for crystal clear typography on image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/25 opacity-95 group-hover:opacity-90 transition-opacity" />

            {/* Content Placed Directly on Image */}
            <div className="absolute inset-0 p-3.5 flex flex-col justify-between z-10 text-white">
              {/* Top Meta: Category + Time */}
              <div className="flex items-center justify-between">
                <span className="bg-[#E31E24] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded shadow tracking-wider">
                  {item.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-neutral-100 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded">
                  <Clock className="w-3 h-3 text-red-400" />
                  {item.date}
                </span>
              </div>

              {/* Bottom Text: Bold Headline + Summary directly on image */}
              <div>
                <h3 className="font-black text-sm sm:text-base text-white group-hover:text-red-300 transition-colors line-clamp-2 leading-snug tracking-tight drop-shadow-md">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm font-extrabold text-neutral-100 line-clamp-2 mt-1.5 leading-snug drop-shadow">
                  {item.summary}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
