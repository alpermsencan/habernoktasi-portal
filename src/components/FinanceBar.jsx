'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Sun, CloudRain } from 'lucide-react';
import newsData from '@/data/newsData.json';

export default function FinanceBar() {
  const [marketItems, setMarketItems] = useState(newsData.marketData || []);

  const today = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    async function loadRealData() {
      try {
        const res = await fetch('/api/finance', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setMarketItems(json.data);
          }
        }
      } catch (err) {
        console.warn('FinanceBar fetch err:', err);
      }
    }
    loadRealData();
  }, []);

  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 py-1.5 px-4 hidden md:block transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Date & Weather */}
        <div className="flex items-center gap-4">
          <span className="font-bold text-neutral-800 dark:text-neutral-200">{today}</span>
          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <div className="flex items-center gap-1.5 font-bold">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>İstanbul <strong className="text-neutral-900 dark:text-neutral-100">22°C</strong></span>
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            <CloudRain className="w-3.5 h-3.5 text-blue-500" />
            <span>Ankara <strong className="text-neutral-900 dark:text-neutral-100">18°C</strong></span>
          </div>
        </div>

        {/* Right: Market data */}
        <div className="flex items-center gap-5">
          {marketItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5 font-bold">
              <span className="text-neutral-600 dark:text-neutral-400 font-bold">{item.symbol}:</span>
              <span className="text-neutral-900 dark:text-neutral-100 font-black">{item.value}</span>
              <span
                className={`flex items-center text-[11px] font-black ${
                  item.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-hurriyet-red'
                }`}
              >
                {item.isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                )}
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
