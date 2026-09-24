'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function AdBanner({ 
  size = '300x250', // '728x90' | '300x250' | '336x280' | 'auto'
  label = 'SPONSORLU İÇERİK',
  title = 'Yeni Nesil Teknolojik Çözümler',
  description = 'Gelişmiş analitik araçları ve yapay zeka entegrasyonu ile işinizi büyütün.',
  actionText = 'Keşfet',
  sponsorUrl = 'https://www.habernoktasi.com.tr'
}) {
  if (size === '728x90') {
    return (
      <div className="w-full my-6 flex flex-col items-center">
        <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-1">
          — REKLAM ALANI (728x90 LEADERBOARD) —
        </span>
        <div className="w-full max-w-[728px] h-[90px] bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-xl overflow-hidden border border-neutral-700/60 p-4 text-white flex items-center justify-between shadow-sm group cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold bg-hurriyet-red px-2 py-0.5 rounded uppercase">
              {label}
            </span>
            <div>
              <h4 className="text-sm font-bold group-hover:text-red-300 transition">
                {title}
              </h4>
              <p className="text-xs text-neutral-300 hidden sm:block">
                {description}
              </p>
            </div>
          </div>
          <button className="px-4 py-1.5 bg-hurriyet-red hover:bg-hurriyet-darkRed text-white text-xs font-bold rounded-lg transition shrink-0 ml-4 shadow">
            {actionText}
          </button>
        </div>
      </div>
    );
  }

  // Default: 300x250 Medium Rectangle
  return (
    <div className="flex flex-col items-center my-4">
      <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-1.5">
        — REKLAM ALANI (300x250) —
      </span>
      <div className="w-[300px] h-[250px] rounded-xl overflow-hidden relative shadow-md bg-gradient-to-br from-neutral-900 via-neutral-800 to-red-950 p-5 text-white flex flex-col justify-between border border-neutral-700/50 group cursor-pointer">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded tracking-wider uppercase backdrop-blur-sm">
            {label}
          </span>
          <ExternalLink className="w-4 h-4 text-white/70 group-hover:text-white transition" />
        </div>

        <div className="my-auto py-2">
          <div className="text-hurriyet-red font-black text-xs uppercase tracking-widest mb-1">
            ÖZEL FIRSAT
          </div>
          <h4 className="font-serif font-bold text-lg leading-tight group-hover:text-red-300 transition">
            {title}
          </h4>
          <p className="text-xs text-neutral-300 mt-1 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-[11px] font-semibold text-neutral-400">sponsor.com.tr</span>
          <button className="px-3.5 py-1 bg-hurriyet-red hover:bg-hurriyet-darkRed text-white text-xs font-bold rounded-lg shadow transition">
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
}
