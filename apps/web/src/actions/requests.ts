'use server';

import { db } from '@skyline/database';
import { createProjectRequestSchema, CreateProjectRequestInput } from '@skyline/validation';
import { generateTrackingCode } from '@skyline/shared';
import { notifyNewProjectRequest } from '@skyline/notifications';
import { RequestStatus } from '@skyline/types';

export interface SubmitRequestResponse {
  success: boolean;
  trackingCode?: string;
  requestId?: string;
  error?: string;
}

export async function submitProjectRequest(input: CreateProjectRequestInput): Promise<SubmitRequestResponse> {
  try {
    // 1. Strict Zod Validation
    const validated = createProjectRequestSchema.parse(input);

    const trackingCode = generateTrackingCode();

    // 2. Persist Project Request in Database with status REQUESTED
    const request = await db.projectRequest.create({
      data: {
        trackingCode,
        name: validated.name,
        email: validated.email,
        discordUsername: validated.discordUsername || null,
        phoneWhatsApp: validated.phoneWhatsApp || null,
        projectType: validated.projectType,
        serviceId: validated.serviceId || null,
        description: validated.description,
        goals: validated.goals,
        desiredFeatures: validated.desiredFeatures,
        referencesText: validated.referencesText || null,
        existingUrl: validated.existingUrl || null,
        budgetRange: validated.budgetRange,
        timelinePriority: validated.timelinePriority,
        status: RequestStatus.REQUESTED,
        attachments: validated.attachments || undefined,
      },
    });

    // 3. Dispatch Operations Bot Notification to Discord Server
    await notifyNewProjectRequest({
      trackingCode: request.trackingCode,
      customerName: request.name,
      projectType: request.projectType,
      budgetRange: request.budgetRange,
      timelinePriority: request.timelinePriority,
      requestId: request.id,
    }).catch((err) => console.error('Notification error:', err));

    return {
      success: true,
      trackingCode: request.trackingCode,
      requestId: request.id,
    };
  } catch (error: any) {
    console.error('Error submitting project request:', error);
    return {
      success: false,
      error: error?.errors?.[0]?.message || error?.message || 'Failed to submit project request.',
    };
  }
}
