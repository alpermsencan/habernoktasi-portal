'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PenTool, Check, Plus, ExternalLink } from 'lucide-react';

export default function AuthorBio({ author }) {
  const [following, setFollowing] = useState(false);

  if (!author) return null;

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 my-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
        {/* Author Avatar */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 border-2 border-hurriyet-red shadow-md">
          <Image
            src={author.avatar}
            alt={author.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-hurriyet-red uppercase tracking-wider">
                <PenTool className="w-3.5 h-3.5" />
                <span>HÜRRİYET YAZARI</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white">
                {author.name}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {author.role}
              </p>
            </div>

            {/* Follow Author Button */}
            <button
              onClick={() => setFollowing(!following)}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition shadow-sm ${
                following
                  ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                  : 'bg-hurriyet-red hover:bg-hurriyet-darkRed text-white'
              }`}
            >
              {following ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Takip Ediliyor</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Yazarı Takip Et</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3">
            {author.bio}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
            <span>Toplam <strong>{author.articleCount || 2000}+</strong> köşe yazısı</span>
            <a
              href="#tum-yazilari"
              className="text-hurriyet-red hover:text-hurriyet-darkRed font-bold flex items-center gap-1"
            >
              <span>Tüm Yazılarını Oku</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
