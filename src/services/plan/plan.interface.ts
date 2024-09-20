import { Plan } from "@prisma/client";

export interface NewPlan extends Omit<Plan, "id" | "createdAt" | "updatedAt"> {}
