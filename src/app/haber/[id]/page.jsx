import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Clock, 
  Eye, 
  Calendar, 
  ChevronRight, 
  Quote, 
  Tag, 
  Share2, 
  ThumbsUp, 
  Bookmark,
  Sparkles
} from 'lucide-react';
import { getArticleById } from '@/data/getArticle';
import newsData from '@/data/newsData.json';
import ShareBar from '@/components/ShareBar';
import AuthorBio from '@/components/AuthorBio';
import CommentsSection from '@/components/CommentsSection';
import RelatedNews from '@/components/RelatedNews';
import DetailSidebar from '@/components/DetailSidebar';

// SEO Meta Data Generation
export async function generateMetadata({ params }) {
  const article = getArticleById(params.id);
  return {
    title: `${article.title} - Haber Noktası`,
    description: article.spot,
    openGraph: {
      title: article.title,
      description: article.spot,
      type: 'article',
      url: `https://www.habernoktasi.com.tr/haber/${article.id}`,
      images: [
        {
          url: article.mainImage,
          width: 1200,
          height: 675,
          alt: article.title,
        },
      ],
      publishedTime: article.publishDate,
      authors: [article.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.spot,
      images: [article.mainImage],
    },
  };
}

export async function generateStaticParams() {
  const ids = [
    ...newsData.headlineSlider.map((n) => ({ id: String(n.id) })),
    ...newsData.categories.flatMap((cat) => cat.articles.map((art) => ({ id: String(art.id) }))),
    ...(newsData.sicakGundem || []).map((n) => ({ id: String(n.id) })),
    ...(newsData.sliderSideNews || []).map((n) => ({ id: String(n.id) })),
    ...(newsData.todayEvents || []).map((n) => ({ id: String(n.id) })),
    ...(newsData.dynamicFeed || []).map((n) => ({ id: String(n.id) })),
  ];
  return ids;
}

export default function NewsDetailPage({ params }) {
  const article = getArticleById(params.id);

  // Schema.org NewsArticle Structured Data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.spot,
    image: [article.mainImage],
    datePublished: article.publishDate,
    dateModified: article.updateDate,
    author: {
      '@type': 'Person',
      name: article.author.name,
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
          <Link href={`/#${article.categorySlug}`} className="hover:text-hurriyet-red transition uppercase font-semibold">
            {article.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span className="text-neutral-400 truncate max-w-[280px] sm:max-w-md">
            {article.title}
          </span>
        </nav>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Content Column (8 cols) */}
          <div className="lg:col-span-8">
            {/* Category Tag */}
            <div className="inline-block bg-hurriyet-red text-white text-xs font-black uppercase px-3 py-1 rounded shadow-sm tracking-wider mb-3">
              {article.category}
            </div>

            {/* Main Headline (H1, bold, 28-36px) */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black text-neutral-900 dark:text-white leading-tight tracking-tight mb-4">
              {article.title}
            </h1>

            {/* Spot / Summary Text */}
            <p className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-neutral-200 leading-relaxed mb-4 border-l-4 border-hurriyet-red pl-4 py-1.5 bg-red-50/50 dark:bg-neutral-800/40 rounded-r-lg">
              {article.spot}
            </p>

            {/* Metadata Bar (Yazar, Tarih, Okuma Süresi) */}
            <div className="flex flex-wrap items-center justify-between gap-y-2 py-3 border-y border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-neutral-300 dark:border-neutral-700">
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200 block">
                    {article.author.name}
                  </span>
                  <span className="text-[11px] text-hurriyet-red font-medium">
                    {article.author.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px] sm:text-xs">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {article.publishDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime}
                </span>
                <span className="hidden sm:flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {article.readCount}
                </span>
              </div>
            </div>

            {/* Social Share Toolbar */}
            <ShareBar title={article.title} />

            {/* Full-Width Main News Image */}
            <figure className="my-6">
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden shadow-lg bg-neutral-900">
                <Image
                  src={article.mainImage}
                  alt={article.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 850px"
                  className="object-cover"
                />
              </div>
              {article.imageCaption && (
                <figcaption className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 px-1 italic">
                  {article.imageCaption}
                </figcaption>
              )}
            </figure>

            {/* Body Content Blocks */}
            <div className="space-y-5 text-neutral-800 dark:text-neutral-200 text-base leading-[1.7]">
              {article.content.map((block, idx) => {
                switch (block.type) {
                  case 'paragraph':
                    return (
                      <p key={idx} className="text-[16px] leading-[1.75]">
                        {block.text}
                      </p>
                    );

                  case 'highlight':
                    return (
                      <div
                        key={idx}
                        className="my-5 p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-neutral-900 border-l-4 border-hurriyet-red text-neutral-900 dark:text-neutral-100 font-semibold text-base sm:text-lg shadow-sm"
                      >
                        {block.text}
                      </div>
                    );

                  case 'heading':
                    return (
                      <h2
                        key={idx}
                        className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white pt-4 pb-1 border-b border-neutral-200 dark:border-neutral-800"
                      >
                        {block.text}
                      </h2>
                    );

                  case 'quote':
                    return (
                      <blockquote
                        key={idx}
                        className="relative my-6 p-5 sm:p-6 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border-l-4 border-hurriyet-red shadow-inner"
                      >
                        <Quote className="w-8 h-8 text-hurriyet-red/40 mb-2" />
                        <p className="text-base sm:text-lg italic font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed">
                          &ldquo;{block.text}&rdquo;
                        </p>
                        {block.author && (
                          <cite className="block text-xs font-bold text-hurriyet-red uppercase tracking-wider mt-3 not-italic">
                            — {block.author}
                          </cite>
                        )}
                      </blockquote>
                    );

                  default:
                    return null;
                }
              })}
            </div>

            {/* Article Tags */}
            {article.tags && (
              <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <span className="flex items-center gap-1 text-xs font-bold text-neutral-500 uppercase mr-1">
                  <Tag className="w-3.5 h-3.5" />
                  Etiketler:
                </span>
                {article.tags.map((tag, tIdx) => (
                  <a
                    key={tIdx}
                    href={`#etiket-${tag.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-hurriyet-red hover:text-white transition"
                  >
                    #{tag}
                  </a>
                ))}
              </div>
            )}

            {/* Bottom Social Share */}
            <div className="mt-6">
              <ShareBar title={article.title} />
            </div>

            {/* Author Bio Card */}
            <AuthorBio author={article.author} />

            {/* Related News Section */}
            <RelatedNews
              articles={article.relatedArticles}
              currentCategory={article.category}
            />

            {/* Comments Section */}
            <CommentsSection initialComments={article.comments} />
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
