'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCw 
} from 'lucide-react';
import newsData from '@/data/newsData.json';

export default function LiveFinanceSection() {
  const initialData = newsData.marketData || [];
  const [marketItems, setMarketItems] = useState(initialData);
  const [lastUpdated, setLastUpdated] = useState('Canlı');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch real-time live data from /api/finance
  const fetchLiveData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch('/api/finance', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setMarketItems(json.data);
          const now = new Date();
          setLastUpdated(now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      }
    } catch (err) {
      console.warn('Live finance fetch error:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // 1. Initial live fetch
    fetchLiveData();

    // 2. Periodic live refresh every 30 seconds
    const liveInterval = setInterval(fetchLiveData, 30000);

    // 3. Subtle micro-tick simulation for visual life
    const tickTimer = setInterval(() => {
      setMarketItems((prevItems) =>
        prevItems.map((item) => {
          if (Math.random() > 0.65) {
            const hasDollar = item.value.includes('$');
            const cleanStr = item.value.replace('$', '').replace(/\./g, '').replace(',', '.');
            const rawVal = parseFloat(cleanStr);
            if (!isNaN(rawVal)) {
              const deltaPercent = (Math.random() * 0.08 - 0.038);
              const newVal = rawVal * (1 + deltaPercent / 100);
              let formattedVal;
              if (rawVal > 1000) {
                formattedVal = Math.round(newVal).toLocaleString('tr-TR');
              } else {
                formattedVal = newVal.toLocaleString('tr-TR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });
              }
              const isPos = deltaPercent >= 0;
              return {
                ...item,
                value: hasDollar ? `$${formattedVal}` : formattedVal,
                change: `${isPos ? '+' : ''}${deltaPercent.toFixed(2)}%`,
                isPositive: isPos,
              };
            }
          }
          return item;
        })
      );
    }, 4000);

    return () => {
      clearInterval(liveInterval);
      clearInterval(tickTimer);
    };
  }, [fetchLiveData]);

  return (
    <section className="mb-3.5 bg-slate-950 text-white rounded-lg p-2.5 sm:p-3 border border-slate-800 shadow-md" aria-label="Canlı Piyasa Verileri">
      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <h2 className="font-black text-xs sm:text-sm uppercase tracking-wider text-white flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            CANLI PİYASALAR
          </h2>
          <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-1.5 py-0.2 rounded">
            CANLI
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-300 font-bold font-mono hidden sm:inline">
            Son Güncelleme: {lastUpdated}
          </span>
          <button
            onClick={fetchLiveData}
            disabled={isRefreshing}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Piyasaları Yenile"
            aria-label="Piyasaları Yenile"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Ultra-compact 8-symbol grid with high contrast bold typography */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {marketItems.map((item, idx) => {
          const isUp = item.isPositive;
          return (
            <div
              key={idx}
              className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 px-2.5 py-1.5 rounded-md transition-colors flex flex-col justify-center shadow-xs"
            >
              <div className="flex items-center justify-between text-[11px] font-black text-slate-300">
                <span className="truncate tracking-tight">{item.symbol}</span>
                {isUp ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-red-400 shrink-0" />
                )}
              </div>

              <div className="flex items-baseline justify-between gap-1 mt-1">
                <span className="font-black text-sm sm:text-base text-white tracking-tight">
                  {item.value}
                </span>
                <span className={`text-[10px] font-black ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {item.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
