import fs from 'fs';
import path from 'path';
import axios from 'axios';
import sharp from 'sharp';
import slugify from 'slugify';

export interface ImageProcessingResult {
  success: boolean;
  webPath: string;
  originalUrl?: string;
  error?: string;
}

const DEFAULT_PLACEHOLDER = '/placeholder.webp';

/**
 * Downloads an external image, resizes it to 1200x675 (16:9, fit: 'cover'),
 * converts it to WebP format at 80% quality, and saves it to public/uploads/news/
 */
export async function downloadAndProcessImage(
  rawImageUrl: string | null | undefined,
  title: string
): Promise<string> {
  // If no image URL is provided, fallback immediately to placeholder
  if (!rawImageUrl || typeof rawImageUrl !== 'string' || !rawImageUrl.startsWith('http')) {
    return DEFAULT_PLACEHOLDER;
  }

  try {
    // 1. Prepare target directory in public/uploads/news/
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'news');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // 2. Generate unique and SEO-friendly WebP filename
    const cleanSlug = slugify(title, {
      lower: true,
      strict: true,
      locale: 'tr',
      remove: /[*+~.()'"!:@/]/g,
    }).slice(0, 45) || 'haber';

    const timestamp = Date.now();
    const filename = `${cleanSlug}-${timestamp}.webp`;
    const destinationPath = path.join(uploadsDir, filename);

    // 3. Download the binary stream with axios
    const response = await axios.get<ArrayBuffer>(rawImageUrl, {
      responseType: 'arraybuffer',
      timeout: 8000,
      maxContentLength: 15 * 1024 * 1024, // 15 MB threshold
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        Referer: new URL(rawImageUrl).origin,
      },
      validateStatus: (status) => status >= 200 && status < 300,
    });

    const buffer = Buffer.from(response.data);

    // 4. Process with Sharp: 1200x675, fit: cover, webp 80% quality
    await sharp(buffer)
      .resize(1200, 675, {
        fit: 'cover',
        position: 'centre',
        withoutEnlargement: false,
      })
      .webp({
        quality: 80,
        effort: 4,
      })
      .toFile(destinationPath);

    // 5. Return web relative path
    return `/uploads/news/${filename}`;
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.warn(`[ImageHandler Warning] Failed to process image from "${rawImageUrl}": ${errMessage}. Falling back to placeholder.`);
    return DEFAULT_PLACEHOLDER;
  }
}
