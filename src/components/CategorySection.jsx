'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import NewsCard from './NewsCard';

const categoryBorderColors = {
  gündem: 'border-[#E31E24] text-[#E31E24]',
  dünya: 'border-[#0066CC] text-[#0066CC]',
  ekonomi: 'border-[#059669] text-[#059669]',
  spor: 'border-[#B71015] text-[#B71015]',
  kelebek: 'border-[#D946EF] text-[#D946EF]',
  sağlık: 'border-[#0D9488] text-[#0D9488]',
};

const categoryBarColors = {
  gündem: 'bg-[#E31E24]',
  dünya: 'bg-[#0066CC]',
  ekonomi: 'bg-[#059669]',
  spor: 'bg-[#B71015]',
  kelebek: 'bg-[#D946EF]',
  sağlık: 'bg-[#0D9488]',
};

export default function CategorySection({ category }) {
  const { name, slug, articles } = category;
  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 4);

  const catKey = slug.toLowerCase();
  const barColor = categoryBarColors[catKey] || 'bg-[#E31E24]';
  const textAccent = categoryBorderColors[catKey] || 'text-[#E31E24]';

  return (
    <section id={slug} className="scroll-mt-24 space-y-3">
      {/* Category Header */}
      <div className="flex items-center justify-between border-b-2 border-neutral-200 dark:border-neutral-800 pb-1.5">
        <div className="flex items-center gap-2.5">
          <span className={`w-3.5 h-6 ${barColor} rounded-xs inline-block`} />
          <h2 className="font-black text-xl sm:text-2xl text-neutral-900 dark:text-white uppercase tracking-tight">
            {name}
          </h2>
        </div>

        {/* 'Daha Fazla' link */}
        <Link
          href={`/kategori/${slug}`}
          className={`inline-flex items-center gap-0.5 text-xs sm:text-sm font-black ${textAccent} hover:underline transition`}
        >
          <span>Tüm {name} Haberleri</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 1 Large + 3 Horizontal Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Main Featured Article (7 cols) */}
        <div className="lg:col-span-7">
          {mainArticle && (
            <NewsCard article={mainArticle} category={name} isFeature={true} />
          )}
        </div>

        {/* 3 Secondary Articles Stacked (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-2.5">
          {sideArticles.map((art) => (
            <NewsCard key={art.id} article={art} category={name} isFeature={false} />
          ))}
        </div>
      </div>
    </section>
  );
}
