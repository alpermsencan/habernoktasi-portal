import React from 'react';
import Link from 'next/link';
import { Newspaper, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-20 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/40 text-hurriyet-red mb-6">
        <Newspaper className="w-10 h-10" />
      </div>

      <span className="text-sm font-black uppercase text-hurriyet-red tracking-widest block mb-2">
        404 - SAYFA BULUNAMADI
      </span>

      <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#1A1A1A] dark:text-white mb-4">
        Aradığınız Haber veya Sayfa Yayından Kaldırılmış Olabilir
      </h1>

      <p className="text-base text-[#666666] dark:text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
        Ulaşmaya çalıştığınız haberin bağlantısı değişmiş veya silinmiş olabilir. Güncel manşetlere dönmek için ana sayfayı ziyaret edebilirsiniz.
      </p>

      <div className="flex items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-hurriyet-red hover:bg-hurriyet-darkRed text-white text-sm font-bold rounded-xl transition shadow-md"
        >
          <Home className="w-4 h-4" />
          <span>Ana Sayfaya Dön</span>
        </Link>
      </div>
    </main>
  );
}
