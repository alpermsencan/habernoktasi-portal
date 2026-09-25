'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import EnsonhaberBanner from '@/components/EnsonhaberBanner';

export interface DuoNewsItem {
  id: string | number;
  slug: string;
  title: string;
  category: string;
  image: string;
  badge?: string;
}

// 7 Distinct Curated Pairs for Automatic Daily Rotation
const DAILY_SHOWCASE_PAIRS: DuoNewsItem[][] = [
  // Gün 1: Orta Doğu & Futbol Şoku
  [
    {
      id: 'duo-1',
      slug: 'abd-ordusundan-irana-ikinci-dalga-saldirilari-h1550155',
      title: 'Orta Doğu Barut Fıçısı: ABD Ordusundan İran’a İkinci Dalga Saldırısı Başladı!',
      category: 'DÜNYA',
      image: '/uploads/news/abd-ordusundan-irana-ikinci-dalga-saldirilari-1790287215102.webp',
      badge: 'KRİTİK GELİŞME'
    },
    {
      id: 'duo-2',
      slug: 'mauro-icardinin-sari-kirmizili-hikayesi-4-yillik-yolculuk-sona-erdi-h1550230',
      title: 'Galatasaray’da Asrın Vedası: Mauro Icardi’nin 4 Yıllık Macerasında Flaş Karar!',
      category: 'SPOR',
      image: '/uploads/news/mauro-icardinin-sari-kirmizili-hikayesi-4-yil-1790286911806.webp',
      badge: 'GÜNÜN BOMBASI'
    }
  ],
  // Gün 2: Doğu Anadolu Depremi & Dev Transfer Hamlesi
  [
    {
      id: 'duo-3',
      slug: 'tokatta-4-buyuklugunde-deprem-28540-h1550379',
      title: 'Fay Hattı Yeniden Hareketlendi: Elazığ ve Çevre İllerde Korkutan Sarsıntı!',
      category: 'DEPREM',
      image: '/uploads/news/elazigda-4-buyuklugunde-deprem-1790287177606.webp',
      badge: 'SON DAKİKA DEPREM'
    },
    {
      id: 'duo-4',
      slug: 'mason-greenwooddan-fenerbahce-taraftarina-mesaj-h1550290',
      title: 'Fenerbahçe’de Rüya Gerçek Oldu: Mason Greenwood İmzayı Attı, Detaylar Belli Oldu!',
      category: 'SPOR',
      image: '/uploads/news/fenerbahce-mason-greenwooda-kavustu-1790286908731.webp',
      badge: 'TRANSFER DOSYASI'
    }
  ],
  // Gün 3: Rusya-Ukrayna Masası & Borsa Şoku
  [
    {
      id: 'duo-5',
      slug: 'trumptan-putine-mesaj-savasin-durma-zamani-geldi-h1550163',
      title: 'Kremlin’e Doğrudan Mesaj: Trump’tan Putin’e "Savaş Hemen Şimdi Durmalı" Çağrısı!',
      category: 'DÜNYA',
      image: '/uploads/news/trumptan-putine-mesaj-savasin-durma-zamani-ge-1790287214954.webp',
      badge: 'DİPLOMASİ'
    },
    {
      id: 'duo-6',
      slug: 'borsa-istanbul-haftaya-dususle-basladi-34997-h1549551',
      title: 'Piyasalarda Nefesler Tutuldu: Borsa İstanbul Haftaya Tarihi Düşüşle Girdi!',
      category: 'EKONOMİ',
      image: '/uploads/news/borsa-istanbul-haftaya-dususle-basladi-1790287203379.webp',
      badge: 'PİYASA ALARMI'
    }
  ],
  // Gün 4: Meclis Yargı Paketi & Süperstar Kaptanlık
  [
    {
      id: 'duo-7',
      slug: 'tbmmde-yogun-hafta-12-yargi-paketi-gundemde-h1543916',
      title: 'Milyonları İlgilendiren 12. Yargı Paketi Meclis’te: İşte Yasalaşan Maddelerin Tamamı!',
      category: 'GÜNDEM',
      image: '/uploads/news/12-yargi-paketi-tbmmden-gecti-1790286905193.webp',
      badge: 'YASA MECLİSTE'
    },
    {
      id: 'duo-8',
      slug: 'okan-buruk-duyurdu-victor-osimhenin-de-yeni-sececegimiz-kaptanlar-arasinda-h1550374',
      title: 'Florya’da Tarihi Karar: Okan Buruk Açıkladı, Victor Osimhen Kaptan Oluyor!',
      category: 'SPOR',
      image: '/uploads/news/okan-buruk-duyurdu-victor-osimhen-de-yeni-sec-1790286906006.webp',
      badge: 'FLAŞ GELİŞME'
    }
  ],
  // Gün 5: Venezuela Felaketi & Yerli Sanayi Hamlesi
  [
    {
      id: 'duo-9',
      slug: 'venezuelada-deprem-felaketi-olu-sayisi-4-bin-829-oldu-h1550169',
      title: 'Asrın En Ağır Yıkımı: Venezuela Depreminde Can Kaybı 5 Bini Aştı!',
      category: 'DÜNYA',
      image: '/uploads/news/venezuelada-deprem-felaketi-olu-sayisi-4-bin--1790287214452.webp',
      badge: 'KÜRESEL AFET'
    },
    {
      id: 'duo-10',
      slug: 'cumhurbaskani-erdogan-duyurdu-imalat-sanayi-icin-250-milyar-liralik-bir-finansman-h1549701',
      title: 'Cumhurbaşkanı Erdoğan Müjdeyi Verdi: Sanayici ve Üreticiye 250 Milyar TL Destek!',
      category: 'EKONOMİ',
      image: '/uploads/news/cumhurbaskani-erdogan-taziye-ziyareti-icin-ka-1790287182831.webp',
      badge: 'DEV DESTEK'
    }
  ],
  // Gün 6: Süper Otomobil & Meclis Kulisleri
  [
    {
      id: 'duo-11',
      slug: 'volkswagenin-super-otomobili-boyle-mi-gorunecek-iste-yeni-konsept-goruntuleri-h1548332',
      title: 'Otomotiv Dünyasında Deprem: Gizli Tutulan Süper Otomobil Konsepti Sızdırıldı!',
      category: 'TEKNOLOJİ',
      image: '/uploads/news/volkswagenin-super-otomobili-boyle-mi-gorunec-1790287235680.webp',
      badge: 'ÖZEL SIZINTI'
    },
    {
      id: 'duo-12',
      slug: 'ozgur-ozelin-tbmm-mesaisi-kurultay-icin-imza-toplamaya-basliyor-h1538698',
      title: 'Meclis Kulislerinde Sıcak Saatler: Tüzük Kurultayı İçin İmzalar Toplanıyor!',
      category: 'SİYASET',
      image: '/uploads/news/ozgur-ozelin-amcasi-vefat-etti-1790287194463.webp',
      badge: 'ANKARA KULİSİ'
    }
  ],
  // Gün 7: Süper Güçler Zirvesi & Tesla Zammı
  [
    {
      id: 'duo-13',
      slug: 'tesla-turkiyede-supercharger-fiyatlarina-zam-yapti-h1547718',
      title: 'Elektrikli Araç Sahiplerine Kötü Sürpriz: Türkiye Şarj Tarifesine Büyük Zam Geldi!',
      category: 'EKONOMİ',
      image: '/uploads/news/tesla-turkiyede-supercharger-fiyatlarina-zam--1790287237810.webp',
      badge: 'FİYAT ARTIŞI'
    },
    {
      id: 'duo-14',
      slug: 'disisleri-bakani-fidan-yunan-mevkidasi-ile-bir-araya-geldi-h1541156',
      title: 'Ege’de Kritik Masada Tarihi Karar: Dışişleri Bakanı Fidan’dan Net Açıklama!',
      category: 'DİPLOMASİ',
      image: '/uploads/news/16-temmuz-sabahi-polislerin-teslim-olan-darbe-1790286908206.webp',
      badge: 'DİPLOMASİ'
    }
  ]
];

export default function FeaturedDuoNews() {
  // Günü gününe otomatik rotasyon: Her gün farklı 2 haber ekrana gelir
  const activePair = useMemo(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const pairIndex = dayOfYear % DAILY_SHOWCASE_PAIRS.length;
    return DAILY_SHOWCASE_PAIRS[pairIndex];
  }, []);

  if (!activePair || activePair.length < 2) return null;

  return (
    <section 
      className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 my-2.5 sm:my-3" 
      aria-label="Günün Öne Çıkan İki Manşeti"
    >
      {activePair.map((item, idx) => (
        <Link
          key={item.slug || item.id}
          href={`/haber/${item.slug}`}
          className="group relative h-[240px] sm:h-[280px] md:h-[300px] w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-300 dark:border-neutral-800 shadow-md hover:shadow-xl transition-all duration-300 block select-none"
        >
          {/* Kaliteli Arka Plan Görseli */}
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* RESİM ÜZERİNDE ENSONHABER TARZI BÜYÜK, KALIN VE RENKLİ BAŞLIK BANNERI (Resim Karartması Yok) */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-3 sm:p-4">
            <EnsonhaberBanner
              title={item.title}
              index={idx}
              id={item.id}
              slug={item.slug}
              size="lg"
            />
          </div>
        </Link>
      ))}
    </section>
  );
}
