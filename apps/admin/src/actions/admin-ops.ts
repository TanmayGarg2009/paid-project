'use server';

import { db } from '@skyline/database';
import { getCurrentAdmin } from '@/actions/auth';
import { 
  ProjectStatus, 
  QuoteStatus, 
  ChangeRequestStatus, 
  DeliverableAccessLevel,
  DeliverableType 
} from '@skyline/types';
import { calculateMilestones } from '@skyline/payments';
import { createQuoteSchema, createChangeRequestSchema } from '@skyline/validation';
import { logAuditEvent } from '@skyline/logging';

// 1. Create and Send Immutable Quote
export async function createAndSendQuote(input: {
  projectRequestId: string;
  projectName: string;
  description: string;
  scope: string;
  deliverables: string[];
  exclusions: string[];
  includedRevisions: number;
  totalPricePaise: number;
  upfrontPercentage: number;
  estimatedDeliveryDays: number;
  quoteExpiresInDays: number;
  termsAndConditions: string;
  adminNotes?: string;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const validated = createQuoteSchema.parse(input);

    const { upfrontAmountPaise, remainingAmountPaise } = calculateMilestones({
      totalPricePaise: validated.totalPricePaise,
      upfrontPercentage: validated.upfrontPercentage,
    });

    const quoteExpiresAt = new Date(Date.now() + validated.quoteExpiresInDays * 24 * 60 * 60 * 1000);
    const targetDeliveryDate = new Date(Date.now() + validated.estimatedDeliveryDays * 24 * 60 * 60 * 1000);

    const quoteCount = await db.quote.count();
    const quoteNumber = `Q-${new Date().getFullYear()}-${(quoteCount + 1).toString().padStart(4, '0')}`;

    // Mark previous active quotes on this request as SUPERSEDED
    await db.quote.updateMany({
      where: {
        projectRequestId: validated.projectRequestId,
        status: { in: [QuoteStatus.DRAFT, QuoteStatus.SENT, QuoteStatus.VIEWED] },
      },
      data: { status: QuoteStatus.SUPERSEDED },
    });

    // Create New Immutable SENT Quote
    const quote = await db.quote.create({
      data: {
        quoteNumber,
        version: 1,
        projectRequestId: validated.projectRequestId,
        projectName: validated.projectName,
        description: validated.description,
        scope: validated.scope,
        deliverables: validated.deliverables,
        exclusions: validated.exclusions,
        includedRevisions: validated.includedRevisions,
        totalPricePaise: validated.totalPricePaise,
        upfrontPercentage: validated.upfrontPercentage,
        upfrontAmountPaise,
        remainingAmountPaise,
        estimatedDeliveryDays: validated.estimatedDeliveryDays,
        targetDeliveryDate,
        quoteExpiresAt,
        status: QuoteStatus.SENT, // Frozen version
        termsAndConditions: validated.termsAndConditions,
        adminNotes: validated.adminNotes || null,
      },
    });

    // Update Request status to QUOTED
    await db.projectRequest.update({
      where: { id: validated.projectRequestId },
      data: { status: 'QUOTED' },
    });

    await logAuditEvent({
      userId: admin.id,
      action: 'QUOTE_SENT',
      entityType: 'Quote',
      entityId: quote.id,
      newValues: { quoteNumber, totalPricePaise: validated.totalPricePaise },
    });

    return { success: true, quoteId: quote.id, quoteNumber };
  } catch (error: any) {
    console.error('Create quote error:', error);
    return { success: false, error: error?.message || 'Failed to create quote' };
  }
}

// 2. Update Project Status with Audit History
export async function updateProjectStatus({
  projectId,
  newStatus,
  reason,
}: {
  projectId: string;
  newStatus: ProjectStatus;
  reason?: string;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const project = await db.project.findUnique({ where: { id: projectId } });
    if (!project) return { success: false, error: 'Project not found' };

    const oldStatus = project.status;

    await db.$transaction(async (tx) => {
      await tx.project.update({
        where: { id: projectId },
        data: { status: newStatus },
      });

      await tx.projectStatusHistory.create({
        data: {
          projectId,
          fromStatus: oldStatus,
          toStatus: newStatus,
          changedBy: admin.id,
          reason: reason || 'Status transitioned by administrator',
        },
      });
    });

    await logAuditEvent({
      userId: admin.id,
      action: 'PROJECT_STATUS_UPDATE',
      entityType: 'Project',
      entityId: projectId,
      oldValues: { status: oldStatus },
      newValues: { status: newStatus, reason },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to update project status' };
  }
}

// 3. Extend / Adjust Target Delivery Date with Reason Log
export async function extendProjectDeadline({
  projectId,
  newTargetDate,
  reason,
}: {
  projectId: string;
  newTargetDate: string;
  reason: string;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const project = await db.project.findUnique({ where: { id: projectId } });
    if (!project) return { success: false, error: 'Project not found' };

    const oldDate = project.targetDeliveryDate;
    const targetDate = new Date(newTargetDate);

    await db.$transaction(async (tx) => {
      await tx.project.update({
        where: { id: projectId },
        data: { targetDeliveryDate: targetDate },
      });

      await tx.projectDeadlineHistory.create({
        data: {
          projectId,
          oldDeadline: oldDate,
          newDeadline: targetDate,
          reason,
          changedBy: admin.id,
        },
      });
    });

    await logAuditEvent({
      userId: admin.id,
      action: 'PROJECT_DEADLINE_EXTENDED',
      entityType: 'Project',
      entityId: projectId,
      oldValues: { targetDeliveryDate: oldDate },
      newValues: { targetDeliveryDate: targetDate, reason },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to extend deadline' };
  }
}

// 4. Create Formal Change Request (Scope expansion)
export async function createChangeRequest(input: {
  projectId: string;
  title: string;
  description: string;
  reason: string;
  additionalPricePaise: number;
  additionalDays: number;
  affectedDeliverables?: string[];
}) {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const validated = createChangeRequestSchema.parse(input);

    const crCount = await db.changeRequest.count({ where: { projectId: validated.projectId } });
    const crNumber = `CR-${(crCount + 1).toString().padStart(3, '0')}`;

    const cr = await db.changeRequest.create({
      data: {
        crNumber,
        projectId: validated.projectId,
        title: validated.title,
        description: validated.description,
        reason: validated.reason,
        additionalPricePaise: validated.additionalPricePaise,
        additionalDays: validated.additionalDays,
        affectedDeliverables: validated.affectedDeliverables || [],
        status: ChangeRequestStatus.CR_CREATED, // Awaiting customer review
      },
    });

    return { success: true, changeRequestId: cr.id, crNumber };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to create Change Request' };
  }
}

// 5. Upload / Add Deliverable to Vault
export async function addProjectDeliverable(input: {
  projectId: string;
  title: string;
  description?: string;
  type: DeliverableType;
  accessLevel: DeliverableAccessLevel;
  fileKey?: string;
  externalUrl?: string;
  fileSizeBytes?: number;
  mimeType?: string;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const deliverable = await db.deliverable.create({
      data: {
        projectId: input.projectId,
        title: input.title,
        description: input.description || null,
        type: input.type,
        accessLevel: input.accessLevel,
        fileKey: input.fileKey || null,
        externalUrl: input.externalUrl || null,
        fileSizeBytes: input.fileSizeBytes || null,
        mimeType: input.mimeType || null,
      },
    });

    return { success: true, deliverableId: deliverable.id };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to add deliverable' };
  }
}

// 6. Moderate Customer Review
export async function toggleReviewPublish(reviewId: string, isPublished: boolean) {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    await db.review.update({
      where: { id: reviewId },
      data: { isPublished },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to moderate review' };
  }
}
