import { db } from '@skyline/database';

export interface AuditLogParams {
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
}

export async function logAuditEvent(params: AuditLogParams) {
  try {
    return await db.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        oldValues: params.oldValues || undefined,
        newValues: params.newValues || undefined,
        ipAddress: params.ipAddress,
      },
    });
  } catch (error) {
    console.error('[AuditLog Error]', error);
  }
}

export const logger = {
  info: (msg: string, meta?: any) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, meta || ''),
  warn: (msg: string, meta?: any) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, meta || ''),
  error: (msg: string, meta?: any) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, meta || ''),
  debug: (msg: string, meta?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${msg}`, meta || '');
    }
  },
};
