'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  TrendingUp, 
  Bookmark, 
  ExternalLink, 
  Twitter, 
  Facebook, 
  Instagram, 
  Youtube, 
  PenTool, 
  Send,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import newsData from '@/data/newsData.json';

export default function Sidebar() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState('bugun'); // 'bugun' | 'hafta'

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setNewsletterEmail('');
      }, 3000);
    }
  };

  return (
    <aside className="space-y-6" aria-label="Yan Menü">
      {/* 1. Köşe Yazarları (Hürriyet'in En İkonik Alanı) */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-hurriyet-red" />
            <h3 className="font-extrabold text-sm uppercase text-neutral-900 dark:text-white tracking-wide">
              YAZARLAR
            </h3>
          </div>
          <a href="#tum-yazarlar" className="text-xs font-semibold text-hurriyet-red hover:underline">
            Tüm Yazarlar
          </a>
        </div>

        <div className="space-y-3.5">
          {newsData.authors.map((author, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 group cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 p-1.5 rounded-lg transition"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-neutral-200 dark:border-neutral-700 group-hover:border-hurriyet-red transition">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-neutral-900 dark:text-neutral-100 group-hover:text-hurriyet-red transition truncate">
                  {author.name}
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 italic mt-0.5">
                  &ldquo;{author.title}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. En Çok Okunan Haberler */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-hurriyet-red" />
            <h3 className="font-extrabold text-sm uppercase text-neutral-900 dark:text-white tracking-wide">
              EN ÇOK OKUNANLAR
            </h3>
          </div>
          <div className="flex items-center text-[11px] bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-md">
            <button
              onClick={() => setActiveTab('bugun')}
              className={`px-2 py-0.5 rounded font-semibold transition ${
                activeTab === 'bugun'
                  ? 'bg-hurriyet-red text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Bugün
            </button>
            <button
              onClick={() => setActiveTab('hafta')}
              className={`px-2 py-0.5 rounded font-semibold transition ${
                activeTab === 'hafta'
                  ? 'bg-hurriyet-red text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Bu Hafta
            </button>
          </div>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {newsData.mostRead.map((item) => (
            <a
              key={item.id}
              href={`#news-${item.id}`}
              className="flex items-center gap-3 py-3 group first:pt-0 last:pb-0"
            >
              {/* Image thumbnail with rank badge */}
              <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-800 shadow-xs">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                    <span className="text-xs text-neutral-400 font-bold">HN</span>
                  </div>
                )}
                <span
                  className={`absolute top-1 left-1 w-5 h-5 rounded flex items-center justify-center text-[10px] font-black shadow-md ${
                    item.rank === 1
                      ? 'bg-hurriyet-red text-white'
                      : item.rank === 2
                      ? 'bg-neutral-900 text-white dark:bg-neutral-800'
                      : 'bg-black/75 backdrop-blur-xs text-white'
                  }`}
                >
                  {item.rank}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black text-hurriyet-red uppercase tracking-wider block mb-0.5">
                  {item.category}
                </span>
                <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-neutral-100 group-hover:text-hurriyet-red transition line-clamp-2 leading-snug">
                  {item.title}
                </h4>
                <div className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 mt-1 flex items-center justify-between">
                  <span>{item.views}</span>
                  <span>{item.time}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 3. 300x250 Reklam Alanı (Standard IAB Medium Rectangle) */}
      <div className="flex flex-col items-center">
        <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-1.5">
          — REKLAM ALANI (300x250) —
        </span>
        <div className="w-[300px] h-[250px] rounded-xl overflow-hidden relative shadow-md bg-gradient-to-br from-neutral-900 via-neutral-800 to-red-950 p-5 text-white flex flex-col justify-between border border-neutral-700/50 group cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded tracking-wider uppercase backdrop-blur-sm">
              Sponsorlu İçerik
            </span>
            <ExternalLink className="w-4 h-4 text-white/70 group-hover:text-white" />
          </div>

          <div className="my-auto py-2">
            <div className="text-hurriyet-red font-black text-xs uppercase tracking-widest mb-1">
              YENİ NESİL OTOMOBİL
            </div>
            <h4 className="font-extrabold text-lg leading-tight group-hover:text-red-300 transition">
              Geleceğin Sürüş Deneyimi Şimdi Yollarda.
            </h4>
            <p className="text-xs text-neutral-300 mt-1 line-clamp-2">
              %100 elektrikli, 700 km menzil ve akıllı otopilot ile hemen test sürüşü yapın.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-[11px] font-semibold text-neutral-400">otomobil.com.tr</span>
            <button className="px-3 py-1 bg-hurriyet-red hover:bg-hurriyet-darkRed text-white text-xs font-bold rounded shadow transition">
              Keşfet
            </button>
          </div>
        </div>
      </div>

      {/* 4. Editörün Seçtikleri */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-neutral-200 dark:border-neutral-800">
          <Bookmark className="w-4 h-4 text-hurriyet-red" />
          <h3 className="font-extrabold text-sm uppercase text-neutral-900 dark:text-white tracking-wide">
            EDİTÖRÜN SEÇTİKLERİ
          </h3>
        </div>

        <div className="space-y-3">
          {newsData.editorsPicks.map((pick) => (
            <a
              key={pick.id}
              href={`#pick-${pick.id}`}
              className="flex items-center gap-3 group p-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition"
            >
              <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-800">
                <Image
                  src={pick.image}
                  alt={pick.title}
                  fill
                  sizes="64px"
                  className="object-cover group-hover:scale-105 transition"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-hurriyet-red uppercase">
                  {pick.category}
                </span>
                <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-hurriyet-red transition line-clamp-2 leading-snug">
                  {pick.title}
                </h4>
                <span className="text-[10px] text-neutral-400 mt-0.5 block">
                  {pick.readTime}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 5. Sosyal Medya Bileşenleri (Follow & Social widgets) */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <h3 className="font-extrabold text-sm uppercase text-neutral-900 dark:text-white tracking-wide pb-2 mb-3 border-b border-neutral-200 dark:border-neutral-800">
          BİZİ TAKİP EDİN
        </h3>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <a
            href="https://twitter.com/habernoktasi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] dark:hover:bg-[#1DA1F2]/20 transition group"
          >
            <Twitter className="w-4 h-4 text-[#1DA1F2]" />
            <div>
              <div className="font-bold">Twitter (X)</div>
              <div className="text-[10px] text-neutral-500">4.5M Takipçi</div>
            </div>
          </a>

          <a
            href="https://facebook.com/habernoktasi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-[#1877F2]/10 hover:text-[#1877F2] dark:hover:bg-[#1877F2]/20 transition group"
          >
            <Facebook className="w-4 h-4 text-[#1877F2]" />
            <div>
              <div className="font-bold">Facebook</div>
              <div className="text-[10px] text-neutral-500">3.8M Beğeni</div>
            </div>
          </a>

          <a
            href="https://instagram.com/habernoktasicomtr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-[#E1306C]/10 hover:text-[#E1306C] dark:hover:bg-[#E1306C]/20 transition group"
          >
            <Instagram className="w-4 h-4 text-[#E1306C]" />
            <div>
              <div className="font-bold">Instagram</div>
              <div className="text-[10px] text-neutral-500">2.1M Takipçi</div>
            </div>
          </a>

          <a
            href="https://youtube.com/habernoktasi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-[#FF0000]/10 hover:text-[#FF0000] dark:hover:bg-[#FF0000]/20 transition group"
          >
            <Youtube className="w-4 h-4 text-[#FF0000]" />
            <div>
              <div className="font-bold">YouTube</div>
              <div className="text-[10px] text-neutral-500">1.2M Abone</div>
            </div>
          </a>
        </div>

        {/* Mini Twitter / X Feed Simulation */}
        <div className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full flex items-center justify-center text-[10px] font-black">
              𝕏
            </div>
            <span className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200">@HaberNoktasi</span>
            <span className="text-[10px] text-neutral-400">• 15dk</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-snug">
            Son dakika haberleri ve günün özetini anlık bildirimlerle almak için kanalımıza abone olun! #HaberNoktası
          </p>
        </div>
      </div>

      {/* 6. Günlük Bülten Kayıt Kartı */}
      <div className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-neutral-900 rounded-xl p-4 border border-red-200 dark:border-red-900/40 shadow-sm">
        <div className="flex items-center gap-1.5 text-hurriyet-red font-bold text-xs uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>GÜNLÜK ÖZET BÜLTENİ</span>
        </div>
        <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white mb-1">
          Sabah Haberleri E-Postanızda
        </h4>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
          Her sabah 07:00&apos;de Türkiye ve dünya gündeminin en kritik maddeleri kutunuzda.
        </p>

        {subscribed ? (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-neutral-800 p-2.5 rounded-lg border border-emerald-300">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Aramıza hoş geldiniz! Kaydınız alındı.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-2">
            <input
              type="email"
              required
              placeholder="E-posta adresiniz..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-hurriyet-red"
            />
            <button
              type="submit"
              className="w-full py-2 bg-hurriyet-red hover:bg-hurriyet-darkRed text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ücretsiz Abone Ol</span>
            </button>
          </form>
        )}
      </div>
    </aside>
  );
}
