import { NextRequest, NextResponse } from 'next/server';
import { db } from '@skyline/database';
import { getCurrentAdmin } from '@/actions/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id: projectId } = await params;
  const body = await req.json();

  if (!body.content) {
    return NextResponse.json({ success: false, error: 'Content required' }, { status: 400 });
  }

  try {
    const message = await db.projectMessage.create({
      data: {
        projectId,
        senderId: admin.id,
        content: body.content,
        isFromAdmin: true,
      },
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
