import { Prisma } from "@/lib/db";

export interface INewWebhookEvent extends Prisma.WebhookEventCreateInput {}
