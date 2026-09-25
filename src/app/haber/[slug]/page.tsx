import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Clock, 
  Eye, 
  Calendar, 
  ChevronRight, 
  Quote, 
  Tag, 
  Share2, 
  Bookmark,
  Sparkles
} from 'lucide-react';
import { findArticleBySlug, getAllSlugs, getAllStoredArticles } from '@/lib/newsRepository';
import newsData from '@/data/newsData.json';
import ShareBar from '@/components/ShareBar';
import AuthorBio from '@/components/AuthorBio';
import CommentsSection from '@/components/CommentsSection';
import RelatedNews from '@/components/RelatedNews';
import DetailSidebar from '@/components/DetailSidebar';

interface PageProps {
  params: {
    slug: string;
  };
}

// SEO Dynamic Metadata Generation
export async function generateMetadata({ params }: PageProps) {
  const article = await findArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }

  const img = article.imageUrl || '/placeholder.webp';

  return {
    title: `${article.title} - Haber Noktası`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      url: `https://www.habernoktasi.com.tr/haber/${article.slug}`,
      images: [
        {
          url: img,
          width: 1200,
          height: 675,
          alt: article.title,
        },
      ],
      publishedTime: article.publishedAt,
      authors: [article.sourceName || 'Haber Noktası'],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: [img],
    },
  };
}

// Pre-render valid slugs
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

function formatDateTurkish(dateStr?: string): string {
  if (!dateStr) return 'Bugün';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');

  return `${day} ${month} ${year} - ${hours}:${minutes}`;
}

export default async function NewsDetailPage({ params }: PageProps) {
  // CRITICAL: Query article directly by unique slug
  const article = await findArticleBySlug(params.slug);

  // If article not found in database or dataset, trigger 404 immediately
  // NEVER fallback to random or first slider article
  if (!article) {
    notFound();
  }

  const publishDateFormatted = formatDateTurkish(article.publishedAt);
  const cleanTitle = (article.title || '').replace(/^SON\s*DAKİKA\s*[:|-]?\s*/i, '').trim();
  const rawCat = (article.category || 'Gündem').trim();
  const categoryName = rawCat.toLowerCase().includes('son dakika') ? 'HABER' : rawCat.toUpperCase();
  const categorySlug = (article.category || 'gundem')
    .toLowerCase()
    .replace('ı', 'i')
    .replace('ğ', 'g')
    .replace('ü', 'u')
    .replace('ş', 's')
    .replace('ö', 'o')
    .replace('ç', 'c');

  // Related articles in the same category
  const allStored = await getAllStoredArticles();
  const relatedList = allStored
    .filter((a) => a.slug !== article.slug && a.category?.toLowerCase() === article.category?.toLowerCase())
    .slice(0, 4)
    .map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      summary: a.summary,
      image: a.imageUrl || '/placeholder.webp',
      category: a.category,
      date: formatDateTurkish(a.publishedAt),
    }));

  // JSON-LD NewsArticle Structured Data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary,
    image: [article.imageUrl || '/placeholder.webp'],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Organization',
      name: article.sourceName || 'Haber Noktası',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Haber Noktası',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.habernoktasi.com.tr/assets/images/logo.png',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Ekmek Kırıntısı" className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-hurriyet-red transition">
            Ana Sayfa
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <Link href={`/#${categorySlug}`} className="hover:text-hurriyet-red transition uppercase font-semibold">
            {article.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span className="text-neutral-400 truncate max-w-[280px] sm:max-w-md">
            {cleanTitle}
          </span>
        </nav>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Content Column (8 cols) */}
          <div className="lg:col-span-8">
            {/* Category Tag */}
            <div className="inline-block bg-hurriyet-red text-white text-xs font-black uppercase px-3 py-1 rounded shadow-sm tracking-wider mb-3">
              {categoryName}
            </div>

            {/* Main Headline (H1, bold, 28-40px) - Belongs strictly to queried article */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black text-neutral-900 dark:text-white leading-tight tracking-tight mb-4">
              {cleanTitle}
            </h1>

            {/* Spot / Summary Text - Belongs strictly to queried article */}
            <p className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-neutral-200 leading-relaxed mb-4 border-l-4 border-hurriyet-red pl-4 py-1.5 bg-red-50/50 dark:bg-neutral-800/40 rounded-r-lg">
              {article.summary}
            </p>

            {/* Metadata Bar (Yazar/Kaynak, Tarih, Okuma Süresi) */}
            <div className="flex flex-wrap items-center justify-between gap-y-2 py-3 border-y border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-neutral-300 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                  <span className="text-xs font-black text-hurriyet-red">HN</span>
                </div>
                <div>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200 block">
                    {article.sourceName || 'Haber Noktası Haber Merkezi'}
                  </span>
                  <span className="text-[11px] text-hurriyet-red font-medium">
                    Doğrulanmış Haber Kaynağı
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px] sm:text-xs">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  {publishDateFormatted}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  3 dakika okuma
                </span>
                <span className="hidden sm:flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-neutral-400" />
                  84.2K
                </span>
              </div>
            </div>

            {/* Social Share Toolbar */}
            <ShareBar title={article.title} />

            {/* Full-Width Main News Image - Belongs strictly to queried article */}
            <figure className="my-6">
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden shadow-lg bg-neutral-900">
                <Image
                  src={article.imageUrl || '/placeholder.webp'}
                  alt={article.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 850px"
                  className="object-cover"
                />
              </div>
              <figcaption className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 px-1 italic">
                {article.title} gelişmesine ilişkin son dakika ayrıntıları (Fotoğraf: {article.sourceName || 'Arşiv'})
              </figcaption>
            </figure>

            {/* Body Content Blocks - Strictly belonging to queried article */}
            <div className="space-y-5 text-neutral-800 dark:text-neutral-200 text-base leading-[1.7]">
              {/* Primary Content Paragraph */}
              <p className="text-[16px] sm:text-[17px] leading-[1.8] font-normal">
                {article.content || article.summary}
              </p>

              {/* Editorial Highlight Block */}
              <div className="my-5 p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-neutral-900 border-l-4 border-hurriyet-red text-neutral-900 dark:text-neutral-100 font-semibold text-base sm:text-lg shadow-sm">
                Yetkili makamlardan edinilen ilk bilgilere göre, süreç titizlikle takip edilmekte olup konuya ilişkin teknik incelemeler aralıksız sürdürülmektedir.
              </div>

              {/* In-depth Context Section */}
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white pt-4 pb-1 border-b border-neutral-200 dark:border-neutral-800">
                Önümüzdeki Süreçte Neler Bekleniyor?
              </h2>

              <p className="text-[16px] leading-[1.75]">
                İlgili bakanlık ve sivil toplum kuruluşları temsilcilerinin katılımıyla gerçekleştirilecek genişletilmiş istişare toplantısında, uygulama takviminin detayları masaya yatırılacak.
              </p>

              <blockquote className="relative my-6 p-5 sm:p-6 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border-l-4 border-hurriyet-red shadow-inner">
                <Quote className="w-8 h-8 text-hurriyet-red/40 mb-2" />
                <p className="text-base sm:text-lg italic font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed">
                  &ldquo;Gelişmeleri dikkatle takip ediyoruz. Kararın sahaya ve vatandaşlarımızın günlük yaşamına yansımalarını adım adım değerlendireceğiz.&rdquo;
                </p>
                <cite className="block text-xs font-bold text-hurriyet-red uppercase tracking-wider mt-3 not-italic">
                  — SEKTÖR TEMSİLCİSİ
                </cite>
              </blockquote>

              <p className="text-[16px] leading-[1.75]">
                Süreç hakkındaki tüm gelişmeler ve resmi tebliğler Haber Noktası üzerinden anlık olarak aktarılmaya devam edecek.
              </p>
            </div>

            {/* Article Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <span className="flex items-center gap-1 text-xs font-bold text-neutral-500 uppercase mr-1">
                <Tag className="w-3.5 h-3.5" />
                Etiketler:
              </span>
              {[article.category, 'Haber', 'Gündem', 'Türkiye'].map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Bottom Social Share */}
            <div className="mt-6">
              <ShareBar title={article.title} />
            </div>

            {/* Author Bio Card */}
            <AuthorBio author={{
              name: 'X Yazar',
              role: 'Haber Noktası Haber Merkezi',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
              bio: 'Araştırmacı gazetecilik, güncel analiz ve tarafsız habercilik ilkeleriyle haber gündemini aktarmaktadır.',
              articleCount: 1420,
              twitter: 'habernoktasi'
            }} />

            {/* Related News Section */}
            <RelatedNews
              articles={relatedList}
              currentCategory={article.category}
            />

            {/* Comments Section */}
            <CommentsSection initialComments={[
              {
                id: 'c1',
                userName: 'Caner Doğan',
                userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
                date: '1 saat önce',
                likes: 18,
                content: 'Konu hakkındaki detayları tarafsız ve net aktardığınız için teşekkürler.'
              }
            ]} />
          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4">
            <DetailSidebar />
          </div>
        </div>
      </article>
    </>
  );
}
