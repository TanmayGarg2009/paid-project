import { NextRequest, NextResponse } from 'next/server';
import { getStorageProvider, validateAttachmentSize } from '@skyline/storage';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const key = req.nextUrl.searchParams.get('key');

    if (!file || !key) {
      return NextResponse.json({ success: false, error: 'Missing file or key' }, { status: 400 });
    }

    if (!validateAttachmentSize(file.size)) {
      return NextResponse.json({ success: false, error: 'File size exceeds allowed limit' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const storage = getStorageProvider();
    await storage.saveFileBuffer({
      fileKey: key,
      buffer,
      mimeType: file.type,
    });

    return NextResponse.json({ success: true, fileKey: key });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
