import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  try {
    process.env.DATABASE_URL = Buffer.from(
      'bXlzcWw6Ly91NDI3OTFfNkFIbXNYSUszYjpLQWYzJTJCJTJCVThkQzNRJTIxJTVFU0FJbW1LaEJpWUA5MS45OS4xNTkuMjIyOjMzMDYvczQyNzkxX25vcnRoc3RhY2tkaWdpdGFscw==',
      'base64'
    ).toString('utf-8');
  } catch {
    // Fallback
  }
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const db =
  globalThis.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

export * from '@prisma/client';
