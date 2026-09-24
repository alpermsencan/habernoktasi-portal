import fs from 'fs';
import path from 'path';
import axios from 'axios';
import sharp from 'sharp';
import slugify from 'slugify';

export interface DownloadImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  folder?: string;
}

const DEFAULT_PLACEHOLDER = '/placeholder.webp';

/**
 * Downloads an image from media:content URL, resizes and converts to WebP via Sharp,
 * and saves it into public/uploads/news/{slug}-{timestamp}.webp
 *
 * @param imageUrl The image URL extracted from <media:content url="..." />
 * @param title Article title used to generate clean SEO slug for filename
 * @param options Optional resizing parameters (defaults to 1200x675 @ 80% WebP)
 * @returns Local relative web path (e.g. /uploads/news/sample-12345.webp) or /placeholder.webp
 */
export async function downloadAndOptimizeImage(
  imageUrl: string | null | undefined,
  title: string,
  options: DownloadImageOptions = {}
): Promise<string> {
  const {
    width = 1200,
    height = 675,
    quality = 80,
    folder = 'news',
  } = options;

  if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
    return DEFAULT_PLACEHOLDER;
  }

  try {
    // 1. Ensure target directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folder);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // 2. Generate clean slugified filename
    const cleanSlug = slugify(title || 'haber', {
      lower: true,
      strict: true,
      locale: 'tr',
      remove: /[*+~.()'"!:@/]/g,
    }).slice(0, 45) || 'ensonhaber';

    const timestamp = Date.now();
    const filename = `${cleanSlug}-${timestamp}.webp`;
    const destinationPath = path.join(uploadsDir, filename);

    // 3. Download binary image buffer via axios
    const response = await axios.get<ArrayBuffer>(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 8000,
      maxContentLength: 20 * 1024 * 1024, // 20 MB limit
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        Referer: new URL(imageUrl).origin,
      },
      validateStatus: (status) => status >= 200 && status < 300,
    });

    const buffer = Buffer.from(response.data);

    // 4. Optimize with Sharp (1200x675 cover, WebP 80%)
    await sharp(buffer)
      .resize(width, height, {
        fit: 'cover',
        position: 'centre',
        withoutEnlargement: false,
      })
      .webp({
        quality,
        effort: 4,
      })
      .toFile(destinationPath);

    // 5. Return web path
    return `/uploads/${folder}/${filename}`;
  } catch (error: any) {
    console.warn(`[ImageDownloader Warning] Failed to download/optimize "${imageUrl}": ${error.message}`);
    return DEFAULT_PLACEHOLDER;
  }
}
