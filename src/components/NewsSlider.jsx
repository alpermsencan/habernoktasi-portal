'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Eye, Share2, ArrowRight } from 'lucide-react';
import newsData from '@/data/newsData.json';

const categoryTagStyles = {
  gündem: 'bg-[#E31E24] text-white',
  siyaset: 'bg-[#E31E24] text-white',
  dünya: 'bg-[#0066CC] text-white',
  ekonomi: 'bg-[#059669] text-white',
  spor: 'bg-[#B71015] text-white',
  futbol: 'bg-[#B71015] text-white',
  teknoloji: 'bg-[#0F766E] text-white',
  magazin: 'bg-[#D946EF] text-white',
  kelebek: 'bg-[#D946EF] text-white',
  sağlık: 'bg-[#0D9488] text-white',
};

export default function NewsSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slides = newsData.headlineSlider || [];
  const sideNews = newsData.sliderSideNews || [];
  const currentSlide = slides[activeIndex] || slides[0];

  // 5-second rotation
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

  if (!currentSlide) return null;

  const catStyle = categoryTagStyles[(currentSlide.category || 'gündem').toLowerCase()] || 'bg-[#E31E24] text-white';

  return (
    <section className="mb-5 overflow-hidden" aria-label="Ana Manşet ve Yan Manşetler">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        
        {/* ================= LEFT: 15-SLIDE HEADLINE CAROUSEL (8 COLS) ================= */}
        <div 
          className="lg:col-span-8 flex flex-col justify-between bg-neutral-950 rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-800 shadow-md h-[420px] sm:h-[460px] md:h-[480px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Visual Canvas Area */}
          <div className="relative flex-1 w-full overflow-hidden bg-neutral-900">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="relative w-full h-full"
              >
                <Image
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  fill
                  priority={activeIndex === 0}
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover object-center"
                />

                {/* Editorial High Contrast Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-transparent opacity-95" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent hidden sm:block" />

                {/* Slide Details */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10 text-white">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-[10px] sm:text-[11px] font-black uppercase px-2.5 py-0.5 rounded shadow tracking-wider ${catStyle}`}>
                      {currentSlide.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-neutral-300 font-bold">
                      <Clock className="w-3 h-3 text-red-400" />
                      {currentSlide.date}
                    </span>
                    <span className="hidden sm:flex items-center gap-1 text-[11px] text-neutral-300 font-bold">
                      <Eye className="w-3 h-3 text-red-400" />
                      {currentSlide.readCount}
                    </span>
                  </div>

                  <Link href={`/haber/${currentSlide.id}`} className="group/title block">
                    <h1 className="font-black text-2xl sm:text-3xl md:text-4xl leading-tight sm:leading-[1.18] text-white drop-shadow-xl mb-2 line-clamp-2 group-hover/title:text-red-400 transition-colors tracking-tight">
                      {currentSlide.title}
                    </h1>
                  </Link>

                  <p className="text-sm sm:text-base md:text-lg font-extrabold text-neutral-100 line-clamp-2 mb-3 max-w-2xl leading-snug sm:leading-relaxed drop-shadow">
                    {currentSlide.summary}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs sm:text-sm">
                    <span className="text-neutral-200 font-bold">
                      Yazar: <strong className="text-white font-black">{currentSlide.author}</strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(window.location.href)}
                      className="p-1.5 rounded bg-white/20 hover:bg-white/40 text-white transition"
                      title="Haberi Paylaş"
                      aria-label="Haberi Paylaş"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Nav Arrows */}
            <button
              onClick={handlePrev}
              aria-label="Önceki Manşet"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-[#E31E24] text-white flex items-center justify-center transition border border-white/20 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Sonraki Manşet"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-[#E31E24] text-white flex items-center justify-center transition border border-white/20 shadow-lg"
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
                  key={slide.id}
                  onClick={() => setActiveIndex(idx)}
                  title={`${idx + 1}. ${slide.title}`}
                  className={`flex-1 min-w-[28px] sm:min-w-0 py-2 px-1 text-center transition-all relative flex flex-col items-center justify-center font-black ${
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

          {/* 5-6 Item Vertical Stack with Small Thumbnails and Bold Titles */}
          <div className="flex-1 divide-y divide-neutral-200 dark:divide-neutral-800 overflow-y-auto p-1.5 flex flex-col justify-between">
            {(newsData.sicakGundem && newsData.sicakGundem.length > 0 ? newsData.sicakGundem.slice(0, 6) : slides.slice(0, 6)).map((item, idx) => (
              <Link
                key={item.id || idx}
                href={`/haber/${item.id}`}
                className="group flex items-center gap-2.5 p-1.5 sm:p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors"
              >
                {/* Small Optimized Image Thumbnail */}
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
