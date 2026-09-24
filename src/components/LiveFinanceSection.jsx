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
          setLastUpdated(now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
        }
      }
    } catch (err) {
      console.warn('Live finance fetch error:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveData();
    const liveInterval = setInterval(fetchLiveData, 30000);

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
    <section 
      className="mb-2.5 bg-slate-950 text-white rounded-lg p-1.5 sm:p-2 border border-slate-800/90 shadow-xs" 
      aria-label="Canlı Piyasa Verileri"
    >
      {/* Top micro bar: Header & Refresh */}
      <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-800/60 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <h2 className="font-black text-[11px] sm:text-xs uppercase tracking-wide text-white flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" />
            CANLI PİYASALAR
          </h2>
          <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-1 py-0.2 rounded hidden sm:inline">
            ANLIK
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
            {lastUpdated}
          </span>
          <button
            onClick={fetchLiveData}
            disabled={isRefreshing}
            className="p-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Piyasaları Yenile"
            aria-label="Piyasaları Yenile"
          >
            <RefreshCw className={`w-2.5 h-2.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Küçültülmüş, mobil uyumlu ve kompakt piyasa kartları */}
      <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-1 sm:gap-1.5">
        {marketItems.map((item, idx) => {
          const isUp = item.isPositive;
          return (
            <div
              key={idx}
              className="bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800/80 px-1.5 py-1 rounded transition-colors flex flex-col justify-center"
            >
              <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold text-slate-400">
                <span className="truncate tracking-tight">{item.symbol}</span>
                {isUp ? (
                  <ArrowUpRight className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                ) : (
                  <ArrowDownRight className="w-2.5 h-2.5 text-red-400 shrink-0" />
                )}
              </div>

              <div className="flex items-baseline justify-between gap-0.5 mt-0.5">
                <span className="font-black text-[11px] sm:text-xs text-white tracking-tight truncate">
                  {item.value}
                </span>
                <span className={`text-[8px] sm:text-[9px] font-bold shrink-0 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
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
