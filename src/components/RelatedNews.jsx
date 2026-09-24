'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Newspaper, ChevronRight } from 'lucide-react';

export default function RelatedNews({ articles = [], currentCategory = 'GÜNDEM' }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t-2 border-hurriyet-red" aria-label="İlgili Haberler">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-hurriyet-red" />
          <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
            İLGİLİ HABERLER ({currentCategory})
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {articles.slice(0, 4).map((art) => (
          <Link
            key={art.id}
            href={`/haber/${art.id}`}
            className="group flex flex-col bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:shadow-md hover:border-hurriyet-red/50 transition-all duration-200"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              <Image
                src={art.image}
                alt={art.title}
                fill
                sizes="(max-width: 640px) 100vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 bg-hurriyet-red text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                {art.category || currentCategory}
              </span>
            </div>

            {/* Info */}
            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 block mb-1">
                  {art.date || 'Bugün'}
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white group-hover:text-hurriyet-red transition-colors line-clamp-2 leading-snug">
                  {art.title}
                </h4>
                {art.summary && (
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {art.summary}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] font-bold text-hurriyet-red">
                <span>Haberi Oku</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
