import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs/promises';
import { BUSINESS_RULES } from '@skyline/config';

export interface StorageProvider {
  generateUploadUrl(params: { fileName: string; mimeType: string; prefix?: string }): Promise<{ uploadUrl: string; fileKey: string }>;
  generateDownloadUrl(params: { fileKey: string; expiresInSeconds?: number }): Promise<string>;
  saveFileBuffer(params: { fileKey: string; buffer: Buffer; mimeType: string }): Promise<string>;
}

// 1. Local Filesystem Storage (Zero external dependency for local dev & testing)
export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;

  constructor(baseDir = './uploads') {
    this.baseDir = path.resolve(process.cwd(), baseDir);
  }

  private async ensureDir() {
    await fs.mkdir(this.baseDir, { recursive: true }).catch(() => {});
  }

  async generateUploadUrl({ fileName, prefix = 'general' }: { fileName: string; mimeType: string; prefix?: string }) {
    const ext = path.extname(fileName) || '';
    const fileKey = `${prefix}/${crypto.randomUUID()}${ext}`;
    // Local API endpoint handler
    const uploadUrl = `/api/storage/upload?key=${encodeURIComponent(fileKey)}`;
    return { uploadUrl, fileKey };
  }

  async generateDownloadUrl({ fileKey }: { fileKey: string; expiresInSeconds?: number }) {
    return `/api/storage/download?key=${encodeURIComponent(fileKey)}`;
  }

  async saveFileBuffer({ fileKey, buffer }: { fileKey: string; buffer: Buffer; mimeType: string }) {
    await this.ensureDir();
    const filePath = path.join(this.baseDir, fileKey);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, buffer);
    return fileKey;
  }
}

// 2. Storage Helper Singleton
export function getStorageProvider(): StorageProvider {
  // If S3 credentials are provided, S3 provider can be instantiated here
  return new LocalStorageProvider();
}

// 3. Validation Helpers
export function validateAttachmentSize(sizeBytes: number): boolean {
  return sizeBytes <= BUSINESS_RULES.maxAttachmentSizeBytes;
}

export function validateDeliverableSize(sizeBytes: number): boolean {
  return sizeBytes <= BUSINESS_RULES.maxDeliverableSizeBytes;
}
