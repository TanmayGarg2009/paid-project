import { NextRequest, NextResponse } from 'next/server';
import { db } from '@skyline/database';
import { getCurrentCustomer } from '@/actions/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id: projectId } = await params;

  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { milestones: true },
    });

    if (!project || project.customerId !== customer.id) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, milestones: project.milestones });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
