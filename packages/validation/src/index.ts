import { z } from 'zod';

// 1. Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  discordUsername: z.string().optional(),
});
export type RegisterInput = z.infer<typeof registerSchema>;

// 2. Project Request Intake Schema
export const createProjectRequestSchema = z.object({
  name: z.string().min(2, 'Full Name is required'),
  email: z.string().email('Valid email address is required'),
  discordUsername: z.string().optional(),
  phoneWhatsApp: z.string().optional(),
  projectType: z.string().min(1, 'Please select a project type'),
  serviceId: z.string().optional(),
  description: z.string().min(20, 'Please describe your project in at least 20 characters'),
  goals: z.string().min(10, 'Please describe your primary project goals'),
  desiredFeatures: z.array(z.string()).min(1, 'Please list at least one desired feature'),
  referencesText: z.string().optional(),
  existingUrl: z.string().url().optional().or(z.literal('')),
  budgetRange: z.string().min(1, 'Please select your estimated budget range'),
  timelinePriority: z.enum(['STANDARD', 'EXPRESS', 'NEXT_DAY', 'FLEXIBLE']),
  attachments: z.array(z.object({
    fileName: z.string(),
    fileKey: z.string(),
    fileSizeBytes: z.number(),
    mimeType: z.string(),
  })).optional(),
});
export type CreateProjectRequestInput = z.infer<typeof createProjectRequestSchema>;

// 3. Quote Creation Schema
export const createQuoteSchema = z.object({
  projectRequestId: z.string().min(1),
  projectName: z.string().min(2, 'Project Name is required'),
  description: z.string().min(10, 'Description is required'),
  scope: z.string().min(20, 'Scope of work is required'),
  deliverables: z.array(z.string().min(1)).min(1, 'At least one deliverable is required'),
  exclusions: z.array(z.string()).default([]),
  includedRevisions: z.number().int().min(0).default(2),
  totalPricePaise: z.number().int().positive('Total price must be greater than 0 paise'),
  upfrontPercentage: z.number().int().min(10).max(100).default(50),
  estimatedDeliveryDays: z.number().int().min(1, 'Estimated delivery days must be at least 1'),
  quoteExpiresInDays: z.number().int().min(1).default(14),
  termsAndConditions: z.string().min(10, 'Terms and conditions required'),
  adminNotes: z.string().optional(),
});
export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;

// 4. Change Request Schema
export const createChangeRequestSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(10, 'Description of additional scope is required'),
  reason: z.string().min(5, 'Reason for change request is required'),
  additionalPricePaise: z.number().int().nonnegative('Price cannot be negative'),
  additionalDays: z.number().int().nonnegative('Additional days cannot be negative').default(0),
  affectedDeliverables: z.array(z.string()).default([]),
});
export type CreateChangeRequestInput = z.infer<typeof createChangeRequestSchema>;

// 5. Revision Schema
export const createRevisionSchema = z.object({
  projectId: z.string().min(1),
  description: z.string().min(5, 'Revision summary is required'),
  feedbackDetails: z.string().min(10, 'Detailed feedback is required'),
});
export type CreateRevisionInput = z.infer<typeof createRevisionSchema>;

// 6. Project Message Schema
export const createMessageSchema = z.object({
  projectId: z.string().min(1),
  content: z.string().min(1, 'Message content cannot be empty'),
  attachments: z.array(z.object({
    fileName: z.string(),
    fileKey: z.string(),
    fileSizeBytes: z.number(),
    mimeType: z.string(),
  })).optional(),
});
export type CreateMessageInput = z.infer<typeof createMessageSchema>;

// 7. Review Schema
export const createReviewSchema = z.object({
  projectId: z.string().min(1),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  headline: z.string().min(2, 'Headline is required').max(120),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(2000),
});
export type CreateReviewInput = z.infer<typeof createReviewSchema>;

// 8. Payment Verification Schema
export const verifyPaymentSchema = z.object({
  projectId: z.string().min(1),
  milestoneId: z.string().optional(),
  changeRequestId: z.string().optional(),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
