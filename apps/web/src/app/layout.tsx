import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BRAND_CONFIG } from '@skyline/config';

export const metadata: Metadata = {
  title: {
    default: `${BRAND_CONFIG.name} — Custom Digital Development & Engineering`,
    template: `%s | ${BRAND_CONFIG.name}`,
  },
  description: BRAND_CONFIG.description,
  metadataBase: new URL(BRAND_CONFIG.url),
  alternates: {
    canonical: '/',
    types: {
      'text/plain': [
        { url: '/llms.txt', title: 'LLM Guide' },
        { url: '/llms-full.txt', title: 'Full LLM Knowledge Base' },
      ],
    },
  },
  other: {
    'llms-txt': '/llms.txt',
    'llms-full-txt': '/llms-full.txt',
  },
  openGraph: {
    title: `${BRAND_CONFIG.name} — ${BRAND_CONFIG.tagline}`,
    description: BRAND_CONFIG.description,
    url: BRAND_CONFIG.url,
    siteName: BRAND_CONFIG.name,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND_CONFIG.name} — ${BRAND_CONFIG.tagline}`,
    description: BRAND_CONFIG.description,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: BRAND_CONFIG.name,
    description: BRAND_CONFIG.description,
    url: BRAND_CONFIG.url,
    logo: `${BRAND_CONFIG.url}/favicon.ico`,
    email: BRAND_CONFIG.supportEmail,
    priceRange: '₹₹₹',
    knowsAbout: [
      'Web Development',
      'Next.js Full-Stack Web Applications',
      'Discord Bot Development',
      'Artificial Intelligence & RAG Systems',
      'Minecraft Plugins & Purpur Architecture',
      'PostgreSQL Database Architecture',
      'REST & tRPC APIs',
      'React Native Mobile Applications',
    ],
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: '12000',
      highPrice: '250000',
      offerCount: '8',
    },
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM summary" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="Full LLM Context" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col justify-between font-sans antialiased bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
