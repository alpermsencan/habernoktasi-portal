import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import FinanceBar from '@/components/FinanceBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  metadataBase: new URL('https://www.habernoktasi.com.tr'),
  title: 'Haber Noktası - Son Dakika Haberler, Güncel Manşetler ve Gazete Haberleri',
  description:
    'Türkiye ve dünyadan son dakika haberleri, güncel siyaset, ekonomi, spor, kelebek ve sağlık haberleri Haber Noktası ile anında elinizin altında.',
  keywords: [
    'Haber Noktası',
    'Son Dakika',
    'Haberler',
    'Gündem',
    'Ekonomi',
    'Dünya',
    'Spor',
    'Kelebek',
    'Sağlık',
    'Yazarlar'
  ],
  authors: [{ name: 'Haber Noktası Medya ve Yayıncılık A.Ş.' }],
  creator: 'Haber Noktası',
  publisher: 'Haber Noktası Yayıncılık',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://www.habernoktasi.com.tr',
    title: 'Haber Noktası - Son Dakika Haberler, Güncel Manşetler',
    description:
      'Türkiye ve dünyadan son dakika haberleri, güncel siyaset, ekonomi, spor haberleri ve köşe yazarları.',
    siteName: 'Haber Noktası',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Haber Noktası Manşet'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Haber Noktası - Son Dakika Haberler, Güncel Manşetler',
    description: 'Türkiye ve dünyadan son dakika haberleri ve köşe yazarları.',
    site: '@HaberNoktasi',
    creator: '@HaberNoktasi',
    images: ['https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80']
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({ children }) {
  // Structured Data (JSON-LD) for Search Engines
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'Haber Noktası',
    url: 'https://www.habernoktasi.com.tr',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.habernoktasi.com.tr/assets/images/logo.png',
      width: 600,
      height: 60
    },
    sameAs: [
      'https://twitter.com/habernoktasi',
      'https://facebook.com/habernoktasi',
      'https://instagram.com/habernoktasicomtr',
      'https://youtube.com/habernoktasi'
    ]
  };

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0d1117] text-neutral-900 dark:text-neutral-100 transition-colors">
        <ThemeProvider>
          <FinanceBar />
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
