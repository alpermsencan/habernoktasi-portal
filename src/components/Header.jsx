'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, User, ChevronDown, Menu, X, Newspaper, Bell, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import AuthModal from './AuthModal';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  const categories = [
    {
      name: 'Gündem',
      href: '/kategori/gundem',
      subcategories: ['Siyaset', 'Adliye', 'Eğitim', 'Çevre', 'Hava Durumu']
    },
    {
      name: 'Dünya',
      href: '/kategori/dunya',
      subcategories: ['Avrupa', 'Orta Doğu', 'Amerika', 'Asya', 'Balkanlar']
    },
    {
      name: 'Ekonomi',
      href: '/kategori/ekonomi',
      subcategories: ['Piyasalar', 'Borsa', 'Kripto', 'Konut', 'KOBİ']
    },
    {
      name: 'Spor',
      href: '/kategori/spor',
      subcategories: ['Futbol', 'Basketbol', 'Voleybol', 'Süper Lig', 'Canlı Skor']
    },
    {
      name: 'Yazarlar',
      href: '#yazarlar',
      subcategories: ['Fatih Altaylı', 'Murat Yetkin', 'Nevşin Mengü', 'İsmail Saymaz', 'Uğur Dündar', 'Çiğdem Toker']
    },
    {
      name: 'Kelebek',
      href: '/kategori/kelebek',
      subcategories: ['Magazin', 'Moda', 'Kültür & Sanat', 'Müzik']
    },
    {
      name: 'Teknoloji',
      href: '/kategori/teknoloji',
      subcategories: ['Yapay Zeka', 'Mobil', 'Otomotiv', 'Oyun']
    },
    {
      name: 'Sağlık',
      href: '/kategori/saglik',
      subcategories: ['Beslenme', 'Koruyucu Sağlık', 'Ruh Sağlığı']
    }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`"${searchQuery}" için arama yapılıyor...`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 transition-colors shadow-sm">
        {/* Main Logo & Action Bar */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Mobile Menu Trigger & Left items */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-neutral-700 dark:text-neutral-200 hover:text-hurriyet-red focus:outline-none"
              aria-label="Menüyü Aç"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-neutral-700 dark:text-neutral-200 hover:text-hurriyet-red"
              aria-label="Arama"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Logo Area */}
          <div className="flex items-center gap-4">
            <Link href="/" className="group flex items-center gap-2">
              <div className="bg-hurriyet-red text-white font-black tracking-tight text-2xl sm:text-3xl px-3.5 py-1.5 rounded-md shadow-md group-hover:bg-hurriyet-darkRed transition flex items-center">
                <span>HABER</span>
                <span className="bg-white text-hurriyet-red px-1.5 py-0.5 rounded ml-1 text-xl sm:text-2xl font-black">NOKTASI</span>
              </div>
            </Link>
            <div className="hidden xl:flex flex-col border-l border-neutral-300 dark:border-neutral-700 pl-3">
              <span className="text-[11px] font-bold text-hurriyet-red tracking-wider uppercase">GÜVENİLİR VE BAĞIMSIZ HABERCİLİK</span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Doğru Bilgi • Anlık Gündem</span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Haber, yazar veya konu ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 rounded-full border border-transparent focus:border-hurriyet-red focus:bg-white dark:focus:bg-neutral-900 focus:outline-none transition duration-200 shadow-inner"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-2.5" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  Temizle
                </button>
              )}
            </form>
          </div>

          {/* Right Actions: Auth, Theme Toggle, E-Gazete */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* E-Gazete Badge */}
            <a
              href="#egazete"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-hurriyet-red bg-hurriyet-lightRed dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-full hover:bg-hurriyet-red hover:text-white transition duration-200"
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>e-Gazete</span>
            </a>

            {/* Dark/Light mode toggle */}
            <ThemeToggle />

            {/* User Login/Register Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-hurriyet-red dark:hover:text-hurriyet-red rounded-lg border border-neutral-300 dark:border-neutral-700 hover:border-hurriyet-red dark:hover:border-hurriyet-red transition"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Giriş Yap</span>
              </button>
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: 'register' })}
                className="hidden sm:inline-block px-3 py-1.5 text-xs font-bold text-white bg-hurriyet-red hover:bg-hurriyet-darkRed rounded-lg transition shadow-sm"
              >
                Kayıt Ol
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Input Drawer when clicked on mobile */}
        {isSearchOpen && (
          <div className="lg:hidden p-3 bg-neutral-100 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Haber veya konu ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-10 py-2 text-sm rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-hurriyet-red"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Categories Navigation Bar (Desktop) */}
        <nav className="hidden lg:block border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <ul className="flex items-center space-x-1 font-bold text-sm tracking-wide">
              <li className="relative group">
                <Link
                  href="/"
                  className="inline-block py-2.5 px-3 text-hurriyet-red border-b-2 border-hurriyet-red"
                >
                  ANA SAYFA
                </Link>
              </li>

              {categories.map((cat, idx) => (
                <li
                  key={idx}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(cat.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a
                    href={cat.href}
                    className="inline-flex items-center gap-1 py-2.5 px-3 text-neutral-800 dark:text-neutral-200 hover:text-hurriyet-red dark:hover:text-hurriyet-red transition border-b-2 border-transparent hover:border-hurriyet-red uppercase"
                  >
                    <span>{cat.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:rotate-180 transition-transform duration-200" />
                  </a>

                  {/* Dropdown Menu */}
                  {activeDropdown === cat.name && (
                    <div className="absolute top-full left-0 w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-b-md shadow-xl py-2 z-50 animate-fade-in">
                      <div className="px-3 py-1 text-[11px] font-semibold text-hurriyet-red uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-700 mb-1">
                        {cat.name} Başlıkları
                      </div>
                      {cat.subcategories.map((sub, sIdx) => (
                        <a
                          key={sIdx}
                          href={`${cat.href}-${sub.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-hurriyet-red transition"
                        >
                          {sub}
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* Live TV & Quick Link */}
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-hurriyet-red bg-red-50 dark:bg-red-950/30 px-2.5 py-1 rounded-full animate-pulse">
                <span className="w-2 h-2 rounded-full bg-hurriyet-red" />
                CANLI YAYIN
              </span>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 max-h-[80vh] overflow-y-auto p-4 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-bold text-hurriyet-red tracking-wider uppercase">Tüm Kategoriler</span>
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                className="text-xs font-semibold text-hurriyet-red hover:underline"
              >
                Giriş Yap / Üye Ol
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <a
                    href={cat.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block font-bold text-sm text-neutral-800 dark:text-neutral-100 py-1 hover:text-hurriyet-red uppercase"
                  >
                    {cat.name}
                  </a>
                  <div className="pl-2 border-l border-neutral-200 dark:border-neutral-700 space-y-0.5">
                    {cat.subcategories.slice(0, 3).map((sub, sIdx) => (
                      <a
                        key={sIdx}
                        href={`${cat.href}-${sub.toLowerCase()}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-xs text-neutral-500 dark:text-neutral-400 hover:text-hurriyet-red py-0.5"
                      >
                        {sub}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
      />
    </>
  );
}
