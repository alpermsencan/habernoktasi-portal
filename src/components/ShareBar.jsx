'use client';

import React, { useState } from 'react';
import { 
  Twitter, 
  Facebook, 
  Share2, 
  Copy, 
  Check, 
  Printer, 
  MessageCircle,
  Bookmark
} from 'lucide-react';

export default function ShareBar({ title, url = '' }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(title);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${title} - ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-neutral-200 dark:border-neutral-800 my-4 text-xs font-semibold">
      {/* Social Buttons */}
      <div className="flex items-center gap-2">
        <span className="text-neutral-500 dark:text-neutral-400 hidden sm:inline mr-1">PAYLAŞ:</span>
        
        {/* Twitter / X */}
        <button
          onClick={shareToTwitter}
          aria-label="Twitter'da Paylaş"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition"
        >
          <Twitter className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Twitter</span>
        </button>

        {/* Facebook */}
        <button
          onClick={shareToFacebook}
          aria-label="Facebook'ta Paylaş"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1877F2] text-white hover:bg-blue-700 transition"
        >
          <Facebook className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Facebook</span>
        </button>

        {/* WhatsApp */}
        <button
          onClick={shareToWhatsApp}
          aria-label="WhatsApp ile Paylaş"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] text-white hover:bg-emerald-600 transition"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          aria-label="Bağlantıyı Kopyala"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Kopyalandı!' : 'Linki Kopyala'}</span>
        </button>
      </div>

      {/* Reader utilities: Bookmark & Print */}
      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
        <button
          onClick={() => setSaved(!saved)}
          className={`flex items-center gap-1 p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition ${
            saved ? 'text-hurriyet-red' : ''
          }`}
          title="Haberi Kaydet"
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-hurriyet-red' : ''}`} />
          <span className="hidden sm:inline">{saved ? 'Kaydedildi' : 'Kaydet'}</span>
        </button>

        <button
          onClick={handlePrint}
          className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition hidden sm:flex items-center gap-1"
          title="Haberi Yazdır"
        >
          <Printer className="w-4 h-4" />
          <span>Yazdır</span>
        </button>
      </div>
    </div>
  );
}
