import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ExternalLink, Flame, RefreshCw } from 'lucide-react';
import { getLatestNews } from '@/lib/newsRepository';
import { INewsArticle } from '@/types/news';

// Revalidate on server every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60;

/**
 * Server Component: Fetches the latest 20 news articles from the database
 * and renders them in a modern, responsive news card grid.
 */
export default async function EnsonhaberNewsPage() {
  // 1. Fetch latest 20 news from repository/database
  const articles: INewsArticle[] = await getLatestNews(20);

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-8 border-b-2 border-[#E31E24] gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E31E24] text-white flex items-center justify-center shadow-md">
              <Flame className="w-6 h-6 fill-white animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-[#E31E24] tracking-wider block">
                CANLI RSS AKIŞI
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 dark:text-white">
                Ensonhaber &amp; Son Dakika Gelişmeleri
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 dark:text-neutral-400">
            <Clock className="w-4 h-4 text-[#E31E24]" />
            <span>Son 20 Haber Yayında</span>
          </div>
        </div>

        {/* Empty State */}
        {articles.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm">
            <RefreshCw className="w-10 h-10 text-neutral-400 mx-auto mb-3 animate-spin" />
            <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
              Henüz senkronize edilmiş haber bulunamadı.
            </h3>
            <p className="text-sm text-neutral-500 mt-1 max-w-md mx-auto">
              Cron senkronizasyonunu tetikleyerek Ensonhaber RSS akışından haberleri çekebilirsiniz.
            </p>
            <div className="mt-4">
              <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-md font-mono text-[#E31E24]">
                GET /api/cron/sync-news?secret=super_secret_cron_token_haber_noktasi_2026
              </code>
            </div>
          </div>
        ) : (
          /* Modern 3-Column Responsive News Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((item) => (
              <article
                key={item.id || item.guid}
                className="group bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-[#E31E24]/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* 16:9 Optimized WebP Image Container */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
                  <Image
                    src={item.imageUrl || '/placeholder.webp'}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Badges: Category & Source */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-[#E31E24] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded shadow tracking-wider">
                      {item.category || 'Gündem'}
                    </span>
                    <span className="bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm shadow">
                      {item.sourceName || 'Ensonhaber'}
                    </span>
                  </div>

                  {/* Published Time Badge */}
                  <div className="absolute bottom-2.5 right-3 text-white/90 text-[11px] font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>
                      {new Date(item.publishedAt).toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-black text-base sm:text-lg text-neutral-950 dark:text-neutral-50 group-hover:text-[#E31E24] transition-colors line-clamp-2 leading-snug tracking-tight mb-2">
                      {item.title}
                    </h2>

                    <p className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Card Footer: External link to original source */}
                  <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-black text-[#E31E24]">
                    <span>Haberi Oku</span>
                    <a
                      href={item.sourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:underline"
                    >
                      <span>Kaynağa Git</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
