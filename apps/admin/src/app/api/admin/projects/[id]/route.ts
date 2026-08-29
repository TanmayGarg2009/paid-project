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

  const { id: projectId } = await params;

  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        customer: true,
        service: true,
        milestones: { orderBy: { createdAt: 'asc' } },
        deliverables: { orderBy: { uploadedAt: 'desc' } },
        changeRequests: { orderBy: { createdAt: 'desc' } },
        revisions: { orderBy: { createdAt: 'desc' } },
        payments: { orderBy: { createdAt: 'desc' } },
        deadlineHistory: { orderBy: { createdAt: 'desc' } },
        messages: {
          include: { sender: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
