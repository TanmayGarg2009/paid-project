import { NextRequest, NextResponse } from 'next/server';
import path from 'node:path';
import fs from 'node:fs/promises';
import { getCurrentCustomer } from '@/actions/auth';
import { db } from '@skyline/database';
import { DeliverableAccessLevel } from '@skyline/types';

export async function GET(req: NextRequest) {
  const customer = await getCurrentCustomer();
  const fileKey = req.nextUrl.searchParams.get('key');

  if (!fileKey) {
    return NextResponse.json({ success: false, error: 'File key required' }, { status: 400 });
  }

  // Security & Deliverable Access Level Validation
  const deliverable = await db.deliverable.findFirst({
    where: { fileKey },
    include: { project: true },
  });

  if (deliverable) {
    // If deliverable is attached to a project, verify caller is owner of project or admin
    if (!customer || deliverable.project.customerId !== customer.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized to download this file.' }, { status: 403 });
    }

    // Verify file is not locked awaiting payment
    if (deliverable.accessLevel === DeliverableAccessLevel.FINAL_LOCKED || deliverable.accessLevel === DeliverableAccessLevel.SOURCE_LOCKED) {
      return NextResponse.json({ success: false, error: 'Deliverable is locked. Please complete final payment.' }, { status: 403 });
    }
  }

  try {
    const filePath = path.resolve(process.cwd(), './uploads', fileKey);
    const fileBuffer = await fs.readFile(filePath);
    const fileName = path.basename(fileKey);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'File not found on storage server' }, { status: 404 });
  }
}
