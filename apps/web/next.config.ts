import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@skyline/database',
    '@skyline/types',
    '@skyline/validation',
    '@skyline/config',
    '@skyline/auth',
    '@skyline/payments',
    '@skyline/notifications',
    '@skyline/storage',
    '@skyline/shared',
    '@skyline/logging',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
    ],
  },
};

export default nextConfig;
