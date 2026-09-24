'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalendarDays, ChevronLeft, ChevronRight, Pause, Play, Hash } from 'lucide-react';
import newsData from '@/data/newsData.json';

export default function TodayEventsBar() {
  const events = newsData.todayEvents || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || events.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, events.length]);

  if (!events.length) return null;
  const currentItem = events[currentIndex] || events[0];
  const itemTitle = currentItem.title || currentItem.text || 'Günün sıcak gelişmeleri';
  const itemTime = currentItem.time || 'Az önce';

  return (
    <div 
      className="bg-slate-950 text-slate-100 border-b border-slate-800 text-xs shadow-xs select-none relative z-10"
      aria-label="Bugün Neler Oldu Akışı"
    >
      <div className="max-w-7xl mx-auto flex items-stretch overflow-hidden">
        {/* Compact Responsive Badge */}
        <div className="bg-[#B71015] text-white px-2.5 sm:px-4 py-2 flex items-center gap-1.5 font-black text-[10px] sm:text-xs tracking-wider uppercase whitespace-nowrap shrink-0">
          <CalendarDays className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="text-amber-300">BUGÜN</span>
          <span className="hidden sm:inline">NELER OLDU?</span>
        </div>

        {/* Content Area - Net Başlık (Açıklamasız) */}
        <div 
          className="flex-1 flex items-center px-2.5 sm:px-4 overflow-hidden min-w-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex items-center gap-2 truncate w-full py-1">
            {/* Thumbnail Image */}
            {currentItem.image && (
              <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded overflow-hidden shrink-0 border border-slate-700 shadow-xs">
                <img
                  src={currentItem.image}
                  alt={itemTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Hashtag Tag */}
            <span className="inline-flex items-center gap-0.5 bg-[#E31E24] text-white font-black text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded tracking-wide shrink-0 shadow-xs">
              <Hash className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              {(currentItem.tag || '#GÜNDEM').replace('#', '')}
            </span>

            {/* Net Haber Başlığı (Açıklama olmaksızın sadece başlık) */}
            <Link 
              href={`/haber/${currentItem.id || 1}`}
              className="font-black text-white hover:text-amber-300 transition-colors truncate text-xs sm:text-sm tracking-tight flex-1 min-w-0"
            >
              {itemTitle}
            </Link>

            {/* Zaman Göstergesi */}
            <span className="text-amber-400 font-bold text-[10px] sm:text-xs shrink-0 pl-1.5">
              {itemTime}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center bg-slate-900 px-1.5 sm:px-2 divide-x divide-slate-800 shrink-0 border-l border-slate-800">
          <div className="hidden md:flex items-center gap-1 px-2 text-[10px] text-slate-300 font-mono font-bold">
            <span>{currentIndex + 1}</span>
            <span>/</span>
            <span>{events.length}</span>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 text-slate-300 hover:text-white transition"
            title={isPaused ? 'Oynat' : 'Durdur'}
            aria-label={isPaused ? 'Oynat' : 'Durdur'}
          >
            {isPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3" />}
          </button>

          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + events.length) % events.length)}
            className="p-1 text-slate-300 hover:text-white transition"
            title="Önceki"
            aria-label="Önceki"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % events.length)}
            className="p-1 text-slate-300 hover:text-white transition"
            title="Sonraki"
            aria-label="Sonraki"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
