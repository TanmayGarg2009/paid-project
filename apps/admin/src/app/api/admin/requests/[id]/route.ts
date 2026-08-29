import { NextRequest, NextResponse } from 'next/server';
import { db } from '@skyline/database';
import { getCurrentAdmin } from '@/actions/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id: requestId } = await params;

  try {
    const request = await db.projectRequest.findUnique({
      where: { id: requestId },
      include: {
        quotes: { orderBy: { version: 'desc' } },
      },
    });

    if (!request) {
      return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, request });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
