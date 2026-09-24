/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: '**.trthaber.com',
      },
      {
        protocol: 'https',
        hostname: '**.ntv.com.tr',
      },
      {
        protocol: 'https',
        hostname: '**.sozcu.com.tr',
      },
      {
        protocol: 'https',
        hostname: '**.hurriyet.com.tr',
      },
      {
        protocol: 'https',
        hostname: '**.ensonhaber.com',
      },
      {
        protocol: 'https',
        hostname: 'imgcdn.ensonhaber.com',
      },
    ],
  },
};

export default nextConfig;
