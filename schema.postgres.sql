-- ========================================================
-- Haber Noktası - PostgreSQL Schema
-- Hostinger VPS / Cloud / Supabase / Neon uyumlu
-- ========================================================

-- 1. Kullanıcılar Tablosu (Users)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'editor', 'user')) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Kategoriler Tablosu (Categories)
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  slug VARCHAR(50) UNIQUE NOT NULL
);

-- 3. Manuel Editör Haberleri Tablosu (News)
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  image_url VARCHAR(500),
  tags VARCHAR(255)[],
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  views INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft'
);

-- 4. Otomatik RSS ile Senkronize Olan Ajans Haberleri Tablosu (News Articles)
CREATE TABLE IF NOT EXISTS news_articles (
  id VARCHAR(64) PRIMARY KEY,
  guid VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL,
  summary TEXT,
  content TEXT,
  source_link VARCHAR(750) UNIQUE NOT NULL,
  source_name VARCHAR(100) NOT NULL,
  category VARCHAR(50) DEFAULT 'Gündem',
  image_url VARCHAR(500) DEFAULT '/placeholder.webp',
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler (Sorgu performansı için)
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category_id);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON news_articles(published_at DESC);

-- Varsayılan Temel Kategorileri Ekle
INSERT INTO categories (name, slug, description) VALUES
('Gündem', 'gundem', 'Türkiye ve dünyadan sıcak gelişmeler'),
('Ekonomi', 'ekonomi', 'Piyasalar, borsa, döviz ve finans haberleri'),
('Spor', 'spor', 'Futbol, basketbol ve tüm spor branşları'),
('Dünya', 'dunya', 'Uluslararası ilişkiler ve küresel olaylar'),
('Teknoloji', 'teknoloji', 'Bilim, yapay zeka ve dijital trendler'),
('Kelebek', 'kelebek', 'Magazin, kültür, sanat ve yaşam'),
('Sağlık', 'saglik', 'Tıp, beslenme ve sağlıklı yaşam haberleri')
ON CONFLICT (slug) DO NOTHING;
