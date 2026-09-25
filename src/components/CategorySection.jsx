'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Clock, Eye, ArrowRight } from 'lucide-react';
import EnsonhaberBanner from '@/components/EnsonhaberBanner';

const categoryBorderColors = {
  gündem: 'border-[#E31E24] text-[#E31E24]',
  dünya: 'border-[#0066CC] text-[#0066CC]',
  ekonomi: 'border-[#059669] text-[#059669]',
  spor: 'border-[#B71015] text-[#B71015]',
  teknoloji: 'border-[#0F766E] text-[#0F766E]',
  kelebek: 'border-[#D946EF] text-[#D946EF]',
  magazin: 'border-[#D946EF] text-[#D946EF]',
  sağlık: 'border-[#0D9488] text-[#0D9488]',
};

const categoryBarColors = {
  gündem: 'bg-[#E31E24]',
  dünya: 'bg-[#0066CC]',
  ekonomi: 'bg-[#059669]',
  spor: 'bg-[#B71015]',
  teknoloji: 'bg-[#0F766E]',
  kelebek: 'bg-[#D946EF]',
  magazin: 'bg-[#D946EF]',
  sağlık: 'bg-[#0D9488]',
};

export default function CategorySection({ category }) {
  const { name, slug, articles = [] } = category;
  const displayArticles = articles.slice(0, 4);

  const catKey = slug.toLowerCase();
  const barColor = categoryBarColors[catKey] || 'bg-[#E31E24]';
  const textAccent = categoryBorderColors[catKey] || 'text-[#E31E24]';

  return (
    <section id={slug} className="scroll-mt-24 space-y-3.5" aria-label={`${name} Haberleri`}>
      {/* Category Header Ribbon */}
      <div className="flex items-center justify-between border-b-2 border-neutral-200 dark:border-neutral-800 pb-2">
        <div className="flex items-center gap-2.5">
          <span className={`w-3.5 h-6 ${barColor} rounded-xs inline-block`} />
          <h2 className="font-black text-xl sm:text-2xl text-neutral-900 dark:text-white uppercase tracking-tight">
            {name}
          </h2>
        </div>

        {/* 'Daha Fazla' link */}
        <Link
          href={slug === 'kelebek' ? '/kategori/kelebek-magazin' : `/kategori/${slug}`}
          className={`inline-flex items-center gap-0.5 text-xs sm:text-sm font-black ${textAccent} hover:underline transition`}
        >
          <span>Tüm {name} Haberleri</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4-Card Responsive Grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {displayArticles.map((article, idx) => (
          <Link
            key={article.slug || article.id || idx}
            href={`/haber/${article.slug || article.id}`}
            className="group bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-800 hover:border-red-500 dark:hover:border-red-500 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            {/* Optimized Next/Image Thumbnail - Ensonhaber Banner Kuşağı (Resim Karartması Yok) */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 shrink-0">
              <Image
                src={article.image || '/placeholder.webp'}
                alt={article.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
              />

              {/* Resim Üzerinde Ensonhaber Tarzı Büyük ve Renkli Başlık Bannerı */}
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-2 sm:p-2.5">
                <EnsonhaberBanner
                  title={article.title}
                  index={idx}
                  id={article.id}
                  slug={article.slug}
                  size="md"
                />
              </div>
            </div>

            {/* Content & Metadata */}
            <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
              <div>
                {/* Publication Date/Time & Views */}
                <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500 dark:text-neutral-400 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-red-500" />
                    {article.date || article.time || 'Bugün'}
                  </span>
                  {article.views && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-neutral-400" />
                      {article.views}
                    </span>
                  )}
                </div>

                {/* Clickable Bold Headline */}
                <h3 className="font-black text-sm sm:text-base text-neutral-950 dark:text-neutral-50 group-hover:text-[#E31E24] transition-colors line-clamp-2 leading-snug tracking-tight mb-1.5">
                  {article.title}
                </h3>

                {/* Summary */}
                {article.summary && (
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                )}
              </div>

              {/* Footer link indicator */}
              <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-black text-[#E31E24]">
                <span>Haberi Oku</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
