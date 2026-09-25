'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Clock, ArrowRight } from 'lucide-react';
import EnsonhaberBanner from '@/components/EnsonhaberBanner';

export interface NewsCardArticle {
  id?: string | number;
  slug?: string;
  title: string;
  summary?: string;
  category?: string;
  image?: string;
  imageUrl?: string;
  date?: string;
  time?: string;
  views?: string;
  readCount?: string;
  author?: string;
}

interface NewsCardProps {
  article: NewsCardArticle;
  category?: string;
  isFeature?: boolean;
}

const categoryColors: Record<string, string> = {
  gündem: 'bg-[#E31E24] text-white',
  siyaset: 'bg-[#E31E24] text-white',
  dünya: 'bg-[#0066CC] text-white',
  ekonomi: 'bg-[#059669] text-white',
  spor: 'bg-[#B71015] text-white',
  futbol: 'bg-[#B71015] text-white',
  teknoloji: 'bg-[#0F766E] text-white',
  magazin: 'bg-[#D97706] text-white',
  sağlık: 'bg-[#0D9488] text-white',
  kelebek: 'bg-[#D946EF] text-white',
};

export default function NewsCard({ article, category, isFeature = false }: NewsCardProps) {
  const catKey = (category || article.category || 'gündem').toLowerCase();
  const badgeClass = categoryColors[catKey] || 'bg-[#E31E24] text-white';
  const imgUrl = article.image || article.imageUrl || '/placeholder.webp';
  const targetSlug = article.slug || String(article.id);

  if (isFeature) {
    return (
      <Link
        href={`/haber/${targetSlug}`}
        className="group relative bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-800 hover:border-red-500 dark:hover:border-red-500 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between block h-full"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <Image
            src={imgUrl}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 550px"
            className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          />
          {/* Ensonhaber Tarzı Büyük ve Renkli Başlık Bannerı (Resim Karartması Yok) */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-2.5 sm:p-3">
            <EnsonhaberBanner
              title={article.title}
              id={article.id}
              slug={targetSlug}
              size="lg"
            />
          </div>
        </div>

        <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 mb-1.5 font-bold">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-red-500" />
                {article.date || article.time || 'Bugün'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-neutral-400" />
                {article.views || article.readCount || '45K'}
              </span>
              {article.author && (
                <>
                  <span>•</span>
                  <span className="truncate">Yazar: <strong className="text-neutral-900 dark:text-neutral-100 font-black">{article.author}</strong></span>
                </>
              )}
            </div>

            <h3 className="font-black text-xl sm:text-2xl md:text-3xl text-neutral-950 dark:text-neutral-50 group-hover:text-[#E31E24] transition-colors line-clamp-2 leading-tight tracking-tight mb-2.5">
              {article.title}
            </h3>

            {article.summary && (
              <p className="text-sm sm:text-base font-bold text-neutral-800 dark:text-neutral-200 line-clamp-3 leading-relaxed">
                {article.summary}
              </p>
            )}
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs sm:text-sm font-black text-[#E31E24]">
            <span>Haber Detayını Gör</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/haber/${targetSlug}`}
      className="group bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-800 hover:border-red-500 dark:hover:border-red-500 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-3 p-3 block"
    >
      {/* Thumbnail */}
      <div className="relative w-full sm:w-40 h-28 shrink-0 rounded overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <Image
          src={imgUrl}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, 160px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Ensonhaber Tarzı Başlık Bannerı */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-1 sm:p-1.5">
          <EnsonhaberBanner
            title={article.title}
            id={article.id}
            slug={targetSlug}
            size="sm"
          />
        </div>
      </div>

      {/* Meta & Title */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-400 mb-1 font-bold">
            <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${badgeClass}`}>
              {category || article.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-red-500" />
              {article.date || article.time || 'Bugün'}
            </span>
            {article.author && (
              <>
                <span>•</span>
                <span className="truncate">Yazar: <strong className="text-neutral-800 dark:text-neutral-200">{article.author}</strong></span>
              </>
            )}
          </div>

          <h4 className="font-black text-sm sm:text-base text-neutral-900 dark:text-white group-hover:text-[#E31E24] transition-colors line-clamp-2 leading-snug tracking-tight">
            {article.title}
          </h4>

          {article.summary && (
            <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1 hidden sm:block">
              {article.summary}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-neutral-400" />
            {article.views || article.readCount || '32K'} Okunma
          </span>
          <span className="text-[#E31E24] font-black group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
            Devamı <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
