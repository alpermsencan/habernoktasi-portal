'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowUp, 
  Twitter, 
  Facebook, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  ShieldCheck, 
  FileText,
  Smartphone
} from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navColumns = [
    {
      title: 'KATEGORİLER',
      links: [
        { label: 'Gündem', href: '#gundem' },
        { label: 'Dünya', href: '#dunya' },
        { label: 'Ekonomi', href: '#ekonomi' },
        { label: 'Spor', href: '#spor' },
        { label: 'Kelebek / Magazin', href: '/kategori/kelebek-magazin' },
        { label: 'Teknoloji', href: '#teknoloji' },
        { label: 'Sağlık', href: '#saglik' },
        { label: 'Yazarlar', href: '#yazarlar' }
      ]
    },
    {
      title: 'KURUMSAL',
      links: [
        { label: 'Hakkımızda', href: '#hakkimizda' },
        { label: 'Künye & İletişim', href: '#kunye' },
        { label: 'Basın Bildirileri', href: '#basin' },
        { label: 'Reklam Verin', href: '#reklam' },
        { label: 'Kariyer Fırsatları', href: '#kariyer' },
        { label: 'Yatırımcı İlişkileri', href: '#yatirimci' }
      ]
    },
    {
      title: 'HUKUK & GİZLİLİK',
      links: [
        { label: 'Kullanım Koşulları', href: '#kosullar' },
        { label: 'KVKK ve Gizlilik Politikası', href: '#kvkk' },
        { label: 'Çerez Politikası', href: '#cerez' },
        { label: 'Okur Temsilcisi', href: '#temsilci' },
        { label: 'Yayın İlkeleri', href: '#ilkeler' }
      ]
    },
    {
      title: 'UYGULAMALAR & SERVİSLER',
      links: [
        { label: 'Haber Noktası Mobil (iOS & Android)', href: '#mobil' },
        { label: 'e-Gazete Dijital Baskı', href: '#egazete' },
        { label: 'RSS Akışları', href: '#rss' },
        { label: 'Haber Bültenleri', href: '#bulten' },
        { label: 'Canlı Borsa & Piyasalar', href: '#piyasa' }
      ]
    }
  ];

  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t-4 border-hurriyet-red mt-16 transition-colors">
      {/* Top Banner with Logo and Back to top */}
      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="bg-hurriyet-red text-white font-black tracking-tight text-2xl sm:text-3xl px-3 py-1.5 rounded shadow flex items-center">
              <span>HABER</span>
              <span className="bg-white text-hurriyet-red px-1.5 py-0.5 rounded ml-1 text-xl sm:text-2xl font-black">NOKTASI</span>
            </div>
            <div className="border-l-0 sm:border-l border-neutral-700 sm:pl-4">
              <p className="text-xs text-neutral-400 font-medium">
                Türkiye&apos;nin en güvenilir, tarafsız ve anlık haber platformu.
              </p>
              <p className="text-[11px] text-hurriyet-red font-bold uppercase tracking-wider">
                Doğru Bilgi • Anlık Haber • Güvenilir Yorum
              </p>
            </div>
          </div>

          {/* Socials & Back to Top */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <a
                href="https://twitter.com/habernoktasi"
                target="_blank"
                rel="noreferrer"
                aria-label="Haber Noktası Twitter"
                className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-[#1DA1F2] text-white flex items-center justify-center transition"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/habernoktasi"
                target="_blank"
                rel="noreferrer"
                aria-label="Haber Noktası Facebook"
                className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-[#1877F2] text-white flex items-center justify-center transition"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/habernoktasicomtr"
                target="_blank"
                rel="noreferrer"
                aria-label="Haber Noktası Instagram"
                className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-[#E1306C] text-white flex items-center justify-center transition"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/habernoktasi"
                target="_blank"
                rel="noreferrer"
                aria-label="Haber Noktası YouTube"
                className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-[#FF0000] text-white flex items-center justify-center transition"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-hurriyet-red text-white text-xs font-semibold rounded-lg transition border border-neutral-700 hover:border-hurriyet-red"
              aria-label="Yukarı Çık"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="hidden sm:inline">Yukarı</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {navColumns.map((col, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="font-extrabold text-xs tracking-wider text-white uppercase border-b border-neutral-800 pb-2">
                {col.title}
              </h4>
              <ul className="space-y-2 text-xs">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a
                      href={link.href}
                      className="text-neutral-400 hover:text-white hover:underline transition"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Legal & Copyright */}
      <div className="border-t border-neutral-800 bg-neutral-950 py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p>
            © {new Date().getFullYear()} Haber Noktası Medya ve Yayıncılık A.Ş. Tüm hakları saklıdır.
            Sitede yayımlanan yazı, haber ve fotoğraflar izin alınmaksızın kaynak gösterilerek dahi iktibas edilemez.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-neutral-400">
            <span>Yayın İlkeleri</span>
            <span>•</span>
            <span>Çerez Ayarları</span>
            <span>•</span>
            <span>İnternet Reklam Birliği</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
