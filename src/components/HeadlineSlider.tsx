'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, Eye } from 'lucide-react';
import newsData from '@/data/newsData.json';
import EnsonhaberBanner from '@/components/EnsonhaberBanner';

export interface SlideItem {
  id?: string | number;
  slug: string;
  title: string;
  summary: string;
  category: string;
  image: string;
  date?: string;
  time?: string;
  readCount?: string;
  views?: string;
  author?: string;
  isHeadline?: boolean;
}



export default function HeadlineSlider() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  const slides: SlideItem[] = (newsData.headlineSlider as SlideItem[]) || [];
  const currentSlide: SlideItem | undefined = slides[activeIndex] || slides[0];

  // 5-second automatic slide rotation
  useEffect(() => {
    if (isPaused || slides.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  // Mobile swipe gestures
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  if (!currentSlide) return null;

  return (
    <section className="mb-5 overflow-hidden" aria-label="Ana Manşet ve Yan Manşetler">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        
        {/* ================= LEFT: 15-SLIDE HEADLINE CAROUSEL (8 COLS) ================= */}
        <div 
          className="lg:col-span-8 flex flex-col justify-between bg-neutral-950 rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-800 shadow-md h-[360px] sm:h-[440px] md:h-[480px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Visual Canvas Area */}
          <div className="relative flex-1 w-full overflow-hidden bg-neutral-900 select-none touch-pan-y">
            {/* Visual Canvas Area - Sıfır Titreme, Donma ve Gecikmesiz Donanım Hızlandırmalı Geçiş */}
            {slides.map((slide, idx) => {
              const isActive = activeIndex === idx;
              // Aktif, önceki ve sonraki slaytları önceden belleğe al (Gecikme ve beyaz/siyah flaşları sıfırla)
              const isAdjacent =
                Math.abs(idx - activeIndex) <= 1 ||
                (activeIndex === 0 && idx === slides.length - 1) ||
                (activeIndex === slides.length - 1 && idx === 0);

              return (
                <div
                  key={slide.slug || slide.id || idx}
                  className={`absolute inset-0 w-full h-full overflow-hidden transition-opacity duration-300 ease-out ${
                    isActive
                      ? 'opacity-100 z-10 pointer-events-auto'
                      : 'opacity-0 z-0 pointer-events-none'
                  }`}
                  style={{
                    willChange: 'opacity',
                    transform: 'translate3d(0, 0, 0)',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={idx === 0 || isAdjacent}
                    loading={isAdjacent ? 'eager' : 'lazy'}
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover object-center"
                    draggable={false}
                  />

                  {/* Sadece Haber Başlığı - Ensonhaber Tarzı Renkli & Çeşitli Banner (Resim Karartması Yok) */}
                  <Link
                    href={`/haber/${slide.slug}`}
                    className="absolute inset-0 z-10 flex flex-col justify-end p-3 sm:p-5 md:p-6 group/slide cursor-pointer"
                    title={slide.title}
                  >
                    <EnsonhaberBanner
                      title={slide.title}
                      index={idx}
                      id={slide.id}
                      slug={slide.slug}
                      size="xl"
                    />
                  </Link>
                </div>
              );
            })}

            {/* Nav Arrows */}
            <button
              onClick={handlePrev}
              aria-label="Önceki Manşet"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-[#E31E24] text-white flex items-center justify-center transition border border-white/20 shadow-lg cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Sonraki Manşet"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-[#E31E24] text-white flex items-center justify-center transition border border-white/20 shadow-lg cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* ================= 15 SIGNATURE NUMBERED TABS (1 TO 15) ================= */}
          <div className="bg-neutral-900 border-t border-neutral-800 flex sm:grid sm:grid-cols-15 divide-x divide-neutral-800 text-center select-none overflow-x-auto scrollbar-none shrink-0 h-10">
            {slides.map((slide, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={slide.slug || slide.id || idx}
                  onClick={() => setActiveIndex(idx)}
                  title={`${idx + 1}. ${slide.title}`}
                  className={`flex-1 min-w-[28px] sm:min-w-0 py-2 px-1 text-center transition-all relative flex flex-col items-center justify-center font-black cursor-pointer ${
                    isActive
                      ? 'bg-[#E31E24] text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  {isActive && (
                    <span className="absolute top-0 left-0 right-0 h-0.5 bg-white animate-pulse" />
                  )}
                  <span className="text-xs sm:text-sm leading-none font-black">{idx + 1}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT: SICAK GÜNDEM / TRENDING SIDE FEED (4 COLS) ================= */}
        <div className="lg:col-span-4 flex flex-col bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-800 shadow-sm h-auto lg:h-[480px]">
          {/* Header Bar */}
          <div className="bg-neutral-900 text-white px-3.5 py-2.5 flex items-center justify-between border-b border-neutral-800 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E31E24] animate-ping" />
              <h2 className="font-black text-sm uppercase tracking-wider text-white">
                Sıcak Gündem
              </h2>
            </div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              GÜNCEL AKIŞ
            </span>
          </div>

          {/* 6 Item Vertical Stack Linking directly to /haber/${item.slug} */}
          <div className="flex-1 divide-y divide-neutral-200 dark:divide-neutral-800 overflow-y-auto p-1.5 flex flex-col justify-between">
            {((newsData.sicakGundem && newsData.sicakGundem.length > 0
              ? (newsData.sicakGundem as SlideItem[])
              : slides
            ).slice(0, 6)).map((item, idx) => (
              <Link
                key={item.slug || item.id || idx}
                href={`/haber/${item.slug}`}
                className="group flex items-center gap-2.5 p-1.5 sm:p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors"
              >
                {/* Thumbnail */}
                <div className="relative w-18 sm:w-20 h-14 sm:h-15 shrink-0 rounded overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                  <Image
                    src={item.image || '/placeholder.webp'}
                    alt={item.title}
                    fill
                    sizes="90px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-0 left-0 bg-[#E31E24] text-white text-[8px] font-black uppercase px-1 leading-none py-0.5">
                    {item.category}
                  </span>
                </div>

                {/* Title and Meta */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-[#E31E24] transition-colors line-clamp-2 leading-snug tracking-tight">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5 text-red-500" />
                      {item.date || item.time || 'Az önce'}
                    </span>
                    {item.views && (
                      <span className="flex items-center gap-0.5">
                        <Eye className="w-2.5 h-2.5 text-neutral-400" />
                        {item.views}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
