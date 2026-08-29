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
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col justify-between font-sans antialiased bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
