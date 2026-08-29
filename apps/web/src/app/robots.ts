import type { MetadataRoute } from 'next';
import { BRAND_CONFIG } from '@skyline/config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = BRAND_CONFIG.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/services',
          '/services/*',
          '/portfolio',
          '/start-project',
          '/login',
          '/register',
          '/llms.txt',
          '/llms-full.txt',
        ],
        disallow: ['/dashboard', '/dashboard/*', '/api/*'],
      },
      {
        userAgent: [
          'GPTBot',
          'ClaudeBot',
          'Google-Extended',
          'PerplexityBot',
          'anthropic-ai',
          'Applebot-Extended',
          'cohere-ai',
          'Bytespider',
          'CCBot',
          'Diffbot',
        ],
        allow: [
          '/',
          '/services',
          '/services/*',
          '/portfolio',
          '/start-project',
          '/llms.txt',
          '/llms-full.txt',
        ],
        disallow: ['/dashboard/*', '/api/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
