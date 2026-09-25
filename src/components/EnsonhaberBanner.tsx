'use client';

import React from 'react';

export interface EnsonhaberBannerProps {
  title: string;
  index?: number;
  id?: string | number;
  slug?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// 20 farklı Ensonhaber varyasyonu için deterministik varyant indeksi üretici
export function getBannerVariant(seed: number | string | undefined, title: string): number {
  if (typeof seed === 'number' && !isNaN(seed)) {
    return Math.abs(seed) % 20;
  }
  const str = String(seed || title || '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 20;
}

// Başlığı Türkçe imla kurallarına uygun olarak iki anlamlı ve vurucu parçaya böler
export function splitHeadline(title: string): { part1: string; part2: string; full: string; hasColon: boolean } {
  const cleanTitle = (title || '')
    .replace(/^son\s*dakika\s*[:\-]\s*/i, '')
    .replace(/^flaş\s*[:\-]\s*/i, '')
    .trim();

  const hasColon = cleanTitle.includes(':');
  let part1 = '';
  let part2 = '';

  if (hasColon) {
    const parts = cleanTitle.split(':');
    part1 = parts[0].trim().toLocaleUpperCase('tr-TR');
    part2 = parts.slice(1).join(':').trim().toLocaleUpperCase('tr-TR');
  } else {
    const words = cleanTitle.split(' ');
    const half = Math.max(1, Math.ceil(words.length * 0.45));
    part1 = words.slice(0, half).join(' ').toLocaleUpperCase('tr-TR');
    part2 = words.slice(half).join(' ').toLocaleUpperCase('tr-TR');
  }

  const full = cleanTitle.toLocaleUpperCase('tr-TR');
  return { part1, part2, full, hasColon };
}

export default function EnsonhaberBanner({
  title,
  index,
  id,
  slug,
  size = 'xl',
  className = '',
}: EnsonhaberBannerProps) {
  const variant = getBannerVariant(index ?? id ?? slug, title);
  const { part1, part2, full, hasColon } = splitHeadline(title);

  // Boyutlara göre ölçeklendirilmiş font ve padding sınıfları (Ekstra Büyük ve Kalın)
  const sizeConfig = {
    xl: {
      wrap: 'max-w-[96%] sm:max-w-[92%] p-3.5 sm:p-5 rounded-2xl',
      title: 'text-xl sm:text-3xl md:text-[36px] lg:text-[42px] xl:text-[46px] leading-[1.08] font-black',
      tag: 'text-xs sm:text-sm px-3.5 py-1 mb-2 font-black',
      quote: 'text-3xl sm:text-5xl font-black',
      border: 'border-l-[8px] sm:border-l-[10px]',
      boxPad: 'px-3.5 sm:px-5 py-2 sm:py-3',
    },
    lg: {
      wrap: 'max-w-[96%] sm:max-w-[94%] p-3 sm:p-4 rounded-xl',
      title: 'text-lg sm:text-2xl md:text-[28px] lg:text-[32px] leading-tight font-black',
      tag: 'text-[11px] sm:text-xs px-2.5 py-0.5 mb-1.5 font-black',
      quote: 'text-2xl sm:text-3xl font-black',
      border: 'border-l-[6px] sm:border-l-[8px]',
      boxPad: 'px-3 sm:px-4 py-1.5 sm:py-2',
    },
    md: {
      wrap: 'max-w-[98%] p-2 sm:p-2.5 rounded-lg',
      title: 'text-sm sm:text-base md:text-[18px] leading-tight font-black',
      tag: 'text-[10px] px-2 py-0.5 mb-1 font-black',
      quote: 'text-xl sm:text-2xl font-black',
      border: 'border-l-[5px]',
      boxPad: 'px-2 py-1',
    },
    sm: {
      wrap: 'max-w-[98%] p-1.5 rounded-md',
      title: 'text-[11px] sm:text-xs leading-tight font-black',
      tag: 'text-[9px] px-1.5 py-0.5 mb-0.5 font-black',
      quote: 'text-base font-black',
      border: 'border-l-[3px]',
      boxPad: 'px-1.5 py-0.5',
    },
  }[size];

  // 20 FARKLI ENSONHABER BANNER VARYASYONU
  switch (variant) {
    // 0: İKONİK YARISI SARI YARISI BEYAZ
    case 0:
      return (
        <div className={`inline-block ${sizeConfig.wrap} bg-black/92 backdrop-blur-xs ${sizeConfig.border} border-[#FFE500] shadow-[0_12px_40px_rgba(0,0,0,0.85)] ${className}`}>
          <div className={`font-black tracking-tight uppercase ${sizeConfig.title}`}>
            <span className="text-[#FFE500] mr-2 inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part1}</span>
            <span className="text-white inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part2}</span>
          </div>
        </div>
      );

    // 1: '' ELEKTRİK MAVİSİ TIRNAK İÇİNDE MANŞET (Alıntı / Şok İfade)
    case 1:
      return (
        <div className={`inline-block ${sizeConfig.wrap} bg-neutral-950/94 backdrop-blur-xs ${sizeConfig.border} border-[#00E5FF] shadow-[0_12px_40px_rgba(0,0,0,0.85)] ${className}`}>
          {hasColon && (
            <div className={`inline-block bg-[#00E5FF] text-black font-black uppercase tracking-wider rounded-xs shadow-sm ${sizeConfig.tag}`}>
              {part1}
            </div>
          )}
          <div className={`font-black tracking-tight uppercase text-white ${sizeConfig.title}`}>
            <span className={`text-[#00E5FF] font-serif font-black mr-1 select-none ${sizeConfig.quote}`}>“</span>
            <span className="text-white drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{hasColon ? part2 : full}</span>
            <span className={`text-[#00E5FF] font-serif font-black ml-1 select-none ${sizeConfig.quote}`}>”</span>
          </div>
        </div>
      );

    // 2: DİKEY KIRMIZI ŞERİT & FOSFOR SARI BAŞLIK
    case 2:
      return (
        <div className={`flex items-stretch ${sizeConfig.wrap} bg-black/92 backdrop-blur-xs rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.85)] ${className}`}>
          <div className="w-2.5 sm:w-4 bg-[#E31E24] shrink-0" />
          <div className="p-2 sm:p-3 flex-1">
            <div className={`inline-block bg-[#E31E24] text-white font-black uppercase tracking-widest rounded-xs shadow ${sizeConfig.tag}`}>
              {part1}
            </div>
            <div className={`font-black tracking-tight uppercase text-[#FFE600] drop-shadow-[0_2px_5px_rgba(0,0,0,1)] ${sizeConfig.title}`}>
              {part2}
            </div>
          </div>
        </div>
      );

    // 3: YATAY ÇİFT KUTU BLOK (Sarı Üst Kutu - Siyah Alt Kutu)
    case 3:
      return (
        <div className={`flex flex-col items-start gap-1 sm:gap-1.5 ${className}`}>
          <div className={`bg-[#FFE500] text-black font-black uppercase rounded-md shadow-[0_8px_25px_rgba(0,0,0,0.75)] tracking-tight ${sizeConfig.boxPad} ${sizeConfig.title}`}>
            {part1}
          </div>
          <div className={`bg-black/95 text-white font-black uppercase rounded-md shadow-[0_8px_25px_rgba(0,0,0,0.75)] tracking-tight border-l-4 border-[#E31E24] ${sizeConfig.boxPad} ${sizeConfig.title}`}>
            {part2}
          </div>
        </div>
      );

    // 4: ELEKTRİK MAVİSİ & KAR BEYAZI
    case 4:
      return (
        <div className={`inline-block ${sizeConfig.wrap} bg-slate-950/94 backdrop-blur-xs ${sizeConfig.border} border-[#38BDF8] shadow-[0_12px_40px_rgba(0,0,0,0.85)] ${className}`}>
          <div className={`font-black tracking-tight uppercase ${sizeConfig.title}`}>
            <span className="text-[#38BDF8] mr-2 inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part1}</span>
            <span className="text-white inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part2}</span>
          </div>
        </div>
      );

    // 5: ATEŞ KIRMIZISI & ALTIN SARISI FLAMİNG
    case 5:
      return (
        <div className={`inline-block ${sizeConfig.wrap} bg-neutral-950/92 backdrop-blur-xs ${sizeConfig.border} border-[#FF2A2A] shadow-[0_12px_40px_rgba(0,0,0,0.85)] ${className}`}>
          <div className={`font-black tracking-tight uppercase ${sizeConfig.title}`}>
            <span className="text-[#FF2A2A] mr-2 inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part1}</span>
            <span className="text-[#FFDE00] inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part2}</span>
          </div>
        </div>
      );

    // 6: FOSFORLU LIME YEŞİLİ & KAR BEYAZI
    case 6:
      return (
        <div className={`inline-block ${sizeConfig.wrap} bg-neutral-950/94 backdrop-blur-xs ${sizeConfig.border} border-[#A3E635] shadow-[0_12px_40px_rgba(0,0,0,0.85)] ${className}`}>
          <div className={`font-black tracking-tight uppercase ${sizeConfig.title}`}>
            <span className="text-[#A3E635] mr-2 inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part1}</span>
            <span className="text-white inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part2}</span>
          </div>
        </div>
      );

    // 7: ATEŞ TURUNCUSU & SİYAH VURGULU BANNER
    case 7:
      return (
        <div className={`inline-block ${sizeConfig.wrap} bg-black/92 backdrop-blur-xs ${sizeConfig.border} border-[#FF6B00] shadow-[0_12px_40px_rgba(0,0,0,0.85)] ${className}`}>
          <div className={`inline-block bg-[#FF6B00] text-black font-black uppercase tracking-wider rounded-xs shadow-sm ${sizeConfig.tag}`}>
            {part1}
          </div>
          <div className={`font-black tracking-tight uppercase text-white drop-shadow-[0_2px_5px_rgba(0,0,0,1)] ${sizeConfig.title}`}>
            {part2}
          </div>
        </div>
      );

    // 8: ÇİFT SARI TIRNAKLI MANŞET & KIRMIZI ROZET
    case 8:
      return (
        <div className={`inline-block ${sizeConfig.wrap} bg-black/95 backdrop-blur-xs border-t-4 border-[#FFE500] rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] ${className}`}>
          <div className={`inline-block bg-[#E31E24] text-white font-black uppercase tracking-widest rounded-xs shadow ${sizeConfig.tag}`}>
            FLAŞ GELİŞME
          </div>
          <div className={`font-black tracking-tight uppercase text-white ${sizeConfig.title}`}>
            <span className={`text-[#FFE500] font-serif font-black mr-1 select-none ${sizeConfig.quote}`}>“</span>
            <span className="text-[#FFE500] mr-2 inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part1}</span>
            <span className="text-white inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part2}</span>
            <span className={`text-[#FFE500] font-serif font-black ml-1 select-none ${sizeConfig.quote}`}>”</span>
          </div>
        </div>
      );

    // 9: TAM SARI MEGA BANNER (Maksimum Merak & Tıklanma)
    case 9:
      return (
        <div className={`inline-block ${sizeConfig.wrap} bg-black/95 backdrop-blur-xs ${sizeConfig.border} border-amber-400 shadow-[0_15px_45px_rgba(0,0,0,0.9)] ${className}`}>
          <div className={`font-black tracking-tight uppercase text-[#FFE500] drop-shadow-[0_3px_8px_rgba(0,0,0,1)] ${sizeConfig.title}`}>
            {full}
          </div>
        </div>
      );

    // 10: DİKEY ELEKTRİK MAVİSİ ŞERİT & SARI-BEYAZ BAŞLIK
    case 10:
      return (
        <div className={`flex items-stretch ${sizeConfig.wrap} bg-slate-950/94 backdrop-blur-xs rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.85)] ${className}`}>
          <div className="w-2.5 sm:w-4 bg-[#00D2FF] shrink-0" />
          <div className="p-2 sm:p-3 flex-1">
            <div className={`inline-block bg-[#00D2FF] text-black font-black uppercase tracking-widest rounded-xs shadow ${sizeConfig.tag}`}>
              {part1}
            </div>
            <div className={`font-black tracking-tight uppercase text-white ${sizeConfig.title}`}>
              <span className="text-[#FFE500] drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part2}</span>
            </div>
          </div>
        </div>
      );

    // 11: ÜÇ RENKLİ BLOK BANNER (Kırmızı Etiket + Sarı Vurgu + Beyaz Devam)
    case 11:
      return (
        <div className={`inline-block ${sizeConfig.wrap} bg-black/92 backdrop-blur-xs border-b-4 border-[#E31E24] shadow-[0_12px_40px_rgba(0,0,0,0.85)] ${className}`}>
          <div className={`inline-block bg-[#E31E24] text-white font-black uppercase tracking-widest rounded-xs shadow mb-1 ${sizeConfig.tag}`}>
            SON DAKİKA
          </div>
          <div className={`font-black tracking-tight uppercase ${sizeConfig.title}`}>
            <span className="text-[#FFE500] mr-2 inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part1}</span>
            <span className="text-white inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part2}</span>
          </div>
        </div>
      );

    // 12: MAGENTA & KAR BEYAZI (Gündem & Magazin Çarpıcılığı)
    case 12:
      return (
        <div className={`inline-block ${sizeConfig.wrap} bg-neutral-950/94 backdrop-blur-xs ${sizeConfig.border} border-[#F43F5E] shadow-[0_12px_40px_rgba(0,0,0,0.85)] ${className}`}>
          <div className={`font-black tracking-tight uppercase ${sizeConfig.title}`}>
            <span className="text-[#FB7185] mr-2 inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part1}</span>
            <span className="text-white inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part2}</span>
          </div>
        </div>
      );

    // 13: KÖŞELİ AÇILI EĞİMLİ ROZET & NEON SARI MANŞET
    case 13:
      return (
        <div className={`inline-block ${sizeConfig.wrap} bg-black/95 backdrop-blur-xs rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] ${className}`}>
          <div className={`inline-block transform -skew-x-6 bg-[#FFE500] text-black font-black uppercase tracking-wider rounded-xs shadow-sm ${sizeConfig.tag}`}>
            {part1}
          </div>
          <div className={`font-black tracking-tight uppercase text-white drop-shadow-[0_2px_5px_rgba(0,0,0,1)] ${sizeConfig.title}`}>
            <span className="text-[#FFE500] mr-2">»</span>
            <span>{part2}</span>
          </div>
        </div>
      );

    // 14: ALARM KUŞAĞI (Koyu Bordo / Kırmızı Vurgu)
    case 14:
      return (
        <div className={`inline-block ${sizeConfig.wrap} bg-black/92 backdrop-blur-xs ${sizeConfig.border} border-[#EF4444] shadow-[0_12px_40px_rgba(0,0,0,0.85)] ${className}`}>
          <div className={`font-black tracking-tight uppercase ${sizeConfig.title}`}>
            <span className="text-[#FDE047] mr-2 inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part1}</span>
            <span className="text-white inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part2}</span>
          </div>
        </div>
      );

    // 15: MOR & ELEKTRİK SARI ŞOK MANŞET
    case 15:
      return (
        <div className={`inline-block ${sizeConfig.wrap} bg-neutral-950/94 backdrop-blur-xs ${sizeConfig.border} border-[#A855F7] shadow-[0_12px_40px_rgba(0,0,0,0.85)] ${className}`}>
          <div className={`font-black tracking-tight uppercase ${sizeConfig.title}`}>
            <span className="text-[#C084FC] mr-2 inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part1}</span>
            <span className="text-[#FDE047] inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part2}</span>
          </div>
        </div>
      );

    // 16: ALTIN SARISI ÇİFT ÇİZGİLİ PRESTİJ BANNERI
    case 16:
      return (
        <div className={`inline-block ${sizeConfig.wrap} bg-black/92 backdrop-blur-xs border-y-2 sm:border-y-4 border-[#F59E0B] shadow-[0_12px_40px_rgba(0,0,0,0.85)] ${className}`}>
          <div className={`font-black tracking-tight uppercase ${sizeConfig.title}`}>
            <span className="text-[#FBBF24] mr-2 inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part1}</span>
            <span className="text-white inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part2}</span>
          </div>
        </div>
      );

    // 17: ZIT KUTU BLOKLARI (Kırmızı Üst Blok, Fosfor Sarı Alt Blok)
    case 17:
      return (
        <div className={`flex flex-col items-start gap-1 sm:gap-1.5 ${className}`}>
          <div className={`bg-[#E31E24] text-white font-black uppercase rounded-md shadow-lg tracking-tight ${sizeConfig.boxPad} ${sizeConfig.title}`}>
            {part1}
          </div>
          <div className={`bg-black/95 text-[#FFE500] font-black uppercase rounded-md shadow-lg tracking-tight border-l-4 border-yellow-400 ${sizeConfig.boxPad} ${sizeConfig.title}`}>
            {part2}
          </div>
        </div>
      );

    // 18: BUZ MAVİSİ & CANLI SARI HİBRİT BANNER
    case 18:
      return (
        <div className={`inline-block ${sizeConfig.wrap} bg-black/92 backdrop-blur-xs border-t-4 border-[#38BDF8] shadow-[0_12px_40px_rgba(0,0,0,0.85)] ${className}`}>
          <div className={`font-black tracking-tight uppercase ${sizeConfig.title}`}>
            <span className="text-[#38BDF8] mr-2 inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part1}</span>
            <span className="text-[#FFE500] inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part2}</span>
          </div>
        </div>
      );

    // 19: SİYAH KUTU & İKİ SATIRLI DEVASA KONTRAST (Ensonhaber Manşet Kuşağı)
    case 19:
    default:
      return (
        <div className={`inline-block ${sizeConfig.wrap} bg-neutral-950/95 backdrop-blur-xs ${sizeConfig.border} border-white shadow-[0_15px_45px_rgba(0,0,0,0.9)] ${className}`}>
          <div className={`font-black tracking-tight uppercase ${sizeConfig.title}`}>
            <span className="text-[#FFE500] mr-2 inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part1}</span>
            <span className="text-white inline drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{part2}</span>
          </div>
        </div>
      );
  }
}
