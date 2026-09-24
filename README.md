# 📰 Haber Noktası - Modern Haber Portalı (Next.js 14 + Tailwind CSS)

Haber Noktası; modern editoryal gazetecilik standartlarını, dinamik canlı RSS veri beslemelerini, otomatik WebP görsel optimizasyonunu ve anlık finans piyasası verilerini bir araya getiren kurumsal bir haber portalı platformudur.

---

## 🚀 Öne Çıkan Özellikler

- **⚡ Next.js 14 (App Router) & Tailwind CSS:** Hızlı, SEO dostu, 69+ statik sayfa ön-derlemesi (SSG) ve dinamik sunucu rotaları (SSR/API).
- **🔄 Otomatik RSS Ajans Senkronizasyonu (`/api/cron/sync-news`):** Türk haber ajanslarından (TRT, NTV, Sözcü vb.) haberleri çeker, mükerrer kayıtları engeller.
- **🖼️ Sharp ile Otomatik WebP Optimizasyonu:** Çekilen haber görsellerini sunucuya indirir, 1200x675 (16:9) WebP formatına sıkıştırır ve `public/uploads/news/` altında yerel olarak barındırır.
- **📈 Canlı Piyasa Entegrasyonu (`/api/finance`):** Dolar, Euro, Gram Altın, Çeyrek Altın, BIST 100, Bitcoin, Gümüş ve Brent petrol verilerini 30 saniyede bir otomatik günceller.
- **📱 15'li Manşet Slider & Sıcak Gündem:** Hürriyet tarzı profesyonel editoryal hiyerarşi, kalın ve dikkat çekici tipografi, canlı son dakika bandı.
- **🌙 Dark / Light Mod Desteği:** Tam duyarlı ve göz yormayan karanlık mod.

---

## 🛠️ Hostinger'da Canlıya Alma (Deployment Rehberi)

Hostinger üzerinde projeyi iki farklı şekilde barındırabilirsiniz:

### Yöntem A: Hostinger Cloud / Web Hosting (Node.js Uygulama Yöneticisi)
1. **hPanel Girişi:** Hostinger hPanel kontrol panelinize girin ve **"Gelişmiş" -> "Node.js"** bölümünü açın.
2. **Node.js Uygulaması Oluşturun:**
   - **Node.js Version:** `20.x` veya `18.x` seçin.
   - **Application Mode:** `Production`
   - **Application Root:** `public_html` (veya `subdomain/haber-noktasi`)
   - **Application Startup File:** `node_modules/next/dist/bin/next` veya `server.js`
3. **Git ile Klonlama:**
   - hPanel'de **Git** menüsünü açın ve GitHub reponuzun URL'sini girin (`main` dalı).
   - Otomatik dağıtım (Deployment webhook) aktif edilebilir.
4. **Bağımlılıkları Yükleme ve Derleme:**
   - hPanel Terminal / SSH üzerinden:
     ```bash
     npm install
     npm run build
     ```
5. **Ortam Değişkenleri (.env):**
   - `.env.example` dosyasını referans alarak `.env.production` dosyasını oluşturun (aşağıdaki tabloya bakın).

---

### Yöntem B: Hostinger VPS (Ubuntu / Debian + PM2 + Nginx) - En Yüksek Performans
Hostinger VPS kullanıyorsanız aşağıdaki adımları sırayla uygulayın:

```bash
# 1. Sunucu paketlerini güncelleyin ve Node.js 20 LTS kurun
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# 2. PM2 (Process Manager) kurun
sudo npm install -g pm2

# 3. Projeyi GitHub'dan çekin
cd /var/www
git clone https://github.com/KULLANICI_ADINIZ/habernoktasi-portal.git
cd habernoktasi-portal

# 4. Bağımlılıkları yükleyin ve derleyin
npm install
npm run build

# 5. PM2 ile Next.js uygulamasını başlatın
pm2 start npm --name "habernoktasi" -- start -- -p 3000
pm2 save
pm2 startup
```

---

## 🗄️ Veritabanı Kurulumu (Database Setup)

Proje hem **PostgreSQL** hem de **MySQL / MariaDB** (Hostinger varsayılanı) şemalarını desteklemektedir:

### 1. Hostinger MySQL / MariaDB (hPanel Kullanıcıları İçin):
1. hPanel üzerinden **Veritabanları -> MySQL Veritabanları** bölümüne gidin.
2. Yeni bir veritabanı ve kullanıcı oluşturun (örn: `u123456789_haberdb`).
3. **phpMyAdmin**'i açın.
4. Projedeki [`schema.sql`](file:///Users/alper/.gemini/antigravity/scratch/hurriyet-news-portal/schema.sql) dosyasının içeriğini SQL sekmesine yapıştırıp çalıştırın (`news_articles` tablosu oluşturulur).

### 2. PostgreSQL (VPS veya Harici DB - Supabase / Neon İçin):
1. VPS veya PostgreSQL sunucunuza bağlanın:
   ```bash
   psql -U postgres -d habernoktasi -f schema.postgres.sql
   ```
2. [`schema.postgres.sql`](file:///Users/alper/.gemini/antigravity/scratch/hurriyet-news-portal/schema.postgres.sql) dosyası `users`, `categories`, `news` ve `news_articles` tablolarını tüm ilişkileriyle otomatik oluşturur.

---

## 🔑 Ortam Değişkenleri (.env.production)

Sunucunuzun ana dizininde `.env.production` adında bir dosya oluşturun:

```env
# ==========================================
# Haber Noktası - Production Environment
# ==========================================

# 1. Cron Güvenlik Anahtarı (Zorunlu)
CRON_SECRET=super_secret_cron_token_haber_noktasi_2026

# 2. Canlı Domain URL'niz
NEXT_PUBLIC_APP_URL=https://www.habernoktasi.com.tr
NODE_ENV=production

# 3. Veritabanı Bağlantısı (Kullandığınız veritabanına göre biri aktif edilir)
# MySQL (Hostinger):
# DATABASE_URL="mysql://veritabani_kullanici:guclu_sifre@localhost:3306/veritabani_adi"

# PostgreSQL (İsteğe bağlı):
# DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/habernoktasi?schema=public"

# MongoDB (İsteğe bağlı):
# MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/habernoktasi?retryWrites=true&w=majority"
```

---

## ⏰ Otomatik Haber Çekme (Hostinger Cron Job Kurulumu)

Haberlerin her 15 dakikada bir otomatik güncellenmesi ve görsellerin optimize edilerek indirilmesi için:

1. hPanel'de **"Gelişmiş" -> "Cron İşleri (Cron Jobs)"** sekmesini açın.
2. Çalışma sıklığını seçin: `*/15 * * * *` (Her 15 dakikada bir).
3. Çalıştırılacak komut kutusuna şunu yazın:

```bash
curl -s -X POST -H "Authorization: Bearer super_secret_cron_token_haber_noktasi_2026" https://www.habernoktasi.com.tr/api/cron/sync-news > /dev/null 2>&1
```

> **Not:** `super_secret_cron_token_haber_noktasi_2026` değerini `.env` dosyanızdaki `CRON_SECRET` ile aynı yapmalısınız.

---

## 💻 Yerel Geliştirme (Local Development)

```bash
# Bağımlılıkları yükleyin:
npm install

# Geliştirme sunucusunu başlatın:
npm run dev

# Tarayıcıda açın:
http://localhost:3000
```
