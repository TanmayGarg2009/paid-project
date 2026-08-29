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

  const { id: quoteId } = await params;

  try {
    const quote = await db.quote.findUnique({
      where: { id: quoteId },
      include: {
        projectRequest: true,
      },
    });

    if (!quote || quote.projectRequest.email.toLowerCase() !== customer.email.toLowerCase()) {
      return NextResponse.json({ success: false, error: 'Quote not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, quote });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
