'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import newsData from '@/data/newsData.json';

export default function BreakingNewsBar() {
  const newsList = newsData.breakingNews;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsList.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, newsList.length]);

  return (
    <div className="bg-[#E31E24] text-white shadow-md relative z-20" aria-label="Son Dakika Haberleri">
      <div className="max-w-7xl mx-auto flex items-stretch overflow-hidden">
        {/* Son Dakika Badge with Pulsing Beacon */}
        <div className="bg-[#B71015] px-2.5 sm:px-5 py-2 sm:py-2.5 flex items-center gap-1.5 sm:gap-2.5 font-black text-[11px] sm:text-xs md:text-sm tracking-wider uppercase whitespace-nowrap shrink-0 shadow-inner">
          <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90" />
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-white" />
          </span>
          <Flame className="w-3.5 h-3.5 fill-white animate-pulse" />
          <span>SON DAKİKA</span>
        </div>

        {/* Dynamic News Ticker with Pause on Hover */}
        <div 
          className="flex-1 relative overflow-hidden flex items-center px-2.5 sm:px-4 min-w-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="w-full flex items-center justify-between min-w-0">
            {(() => {
              const currentHeadline = newsList[currentIndex] || '';
              const clean = currentHeadline.replace(/^SON\s*DAKİKA\s*[:|-]?\s*/i, '').trim();
              const matched = (newsData.headlineSlider || []).find((h) => 
                h.title && (h.title.includes(clean.slice(0, 20)) || clean.includes(h.title.slice(0, 20)))
              ) || (newsData.headlineSlider || [])[0];
              const targetSlug = matched?.slug || '';

              return (
                <Link
                  href={targetSlug ? `/haber/${targetSlug}` : '/'}
                  key={currentIndex}
                  className="text-xs sm:text-sm md:text-base font-extrabold truncate text-white hover:text-amber-200 transition-all duration-300 inline-block py-0.5 animate-fade-in tracking-tight flex-1 min-w-0"
                >
                  {clean}
                </Link>
              );
            })()}

            <div className="flex items-center gap-3 shrink-0 ml-4">
              <span className="hidden md:inline-block text-[11px] text-white/80 font-mono">
                {currentIndex + 1} / {newsList.length}
              </span>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="text-white/70 hover:text-white p-1 rounded"
                title={isPaused ? 'Oynat' : 'Duraklat'}
                aria-label={isPaused ? 'Oynat' : 'Duraklat'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Prev / Next controls */}
        <div className="hidden sm:flex items-center bg-[#B71015]/80 px-2 divide-x divide-white/20">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + newsList.length) % newsList.length)}
            className="p-1.5 text-white/80 hover:text-white transition rounded"
            title="Önceki"
            aria-label="Önceki Son Dakika"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % newsList.length)}
            className="p-1.5 text-white/80 hover:text-white transition rounded pl-2"
            title="Sonraki"
            aria-label="Sonraki Son Dakika"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
