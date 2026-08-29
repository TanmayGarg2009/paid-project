import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { db } from '@skyline/database';
import { getDaysRemaining, formatDate } from '@skyline/shared';
import { sendDiscordNotification } from '@skyline/notifications';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const connection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

export const SLA_QUEUE_NAME = 'skyline-sla-queue';
export const slaQueue = new Queue(SLA_QUEUE_NAME, { connection });

// 1. Worker Processor: Check SLA Deadlines & Expire Quotes
export async function processSlaCheck(job: Job) {
  console.log(`[Worker] Running scheduled SLA & quote checks (Job ${job.id})...`);

  try {
    // A. Check Quotes Expiration
    const expiredQuotes = await db.quote.updateMany({
      where: {
        status: 'SENT',
        quoteExpiresAt: { lt: new Date() },
      },
      data: { status: 'EXPIRED' },
    });

    if (expiredQuotes.count > 0) {
      console.log(`[Worker] Marked ${expiredQuotes.count} quotes as EXPIRED.`);
    }

    // B. Check Approaching Deadlines
    const activeProjects = await db.project.findMany({
      where: { status: { in: ['IN_PROGRESS', 'INTERNAL_QA', 'CUSTOMER_REVIEW', 'REVISION'] } },
      include: { customer: true },
    });

    for (const project of activeProjects) {
      const daysLeft = getDaysRemaining(project.targetDeliveryDate);
      if (daysLeft === 1 || daysLeft === 0) {
        await sendDiscordNotification({
          title: `⚠️ Target Deadline Alert: ${project.projectCode}`,
          description: `Project is scheduled for target delivery ${daysLeft === 0 ? 'TODAY' : 'TOMORROW'}.`,
          color: 0xef4444, // Red
          fields: [
            { name: 'Project', value: project.title, inline: true },
            { name: 'Client', value: project.customer?.name || 'Customer', inline: true },
            { name: 'Target Date', value: formatDate(project.targetDeliveryDate), inline: true },
          ],
        }).catch(() => {});
      }
    }

    return { processed: true, activeCount: activeProjects.length };
  } catch (error) {
    console.error('[Worker Error]', error);
    throw error;
  }
}

// 2. Initialize Worker
export function startWorker() {
  connection.connect().then(() => {
    console.log('[Worker] Connected to Redis successfully.');

    const worker = new Worker(SLA_QUEUE_NAME, processSlaCheck, { connection });

    worker.on('completed', (job: any) => {
      console.log(`[Worker] SLA check job ${job?.id} completed successfully.`);
    });

    worker.on('failed', (job: any, err: any) => {
      console.error(`[Worker] SLA check job ${job?.id} failed:`, err);
    });

    // Schedule hourly repeatable SLA job
    slaQueue.add(
      'hourly-sla-and-quotes-check',
      {},
      {
        repeat: {
          pattern: '0 * * * *', // Every hour
        },
      }
    );
  }).catch((err: any) => {
    console.log('[Worker] Redis not available in current environment. Background worker in standby simulation mode.');
  });
}

if (require.main === module) {
  startWorker();
}
