// types/subscription.ts
/**
 * Tipos compartilhados para Assinaturas TEA
 * (baseados em prisma/schema.prisma e usados em APIs/UI)
 */

export type SubscriptionPlan =
  | "INDIVIDUAL"
  | "DUO_PLUS"
  | "FAMILY_PLUS"
  | "MANTIKORA";

export interface SubscriptionInput {
  plan: SubscriptionPlan;
  endsAt?: Date | string | null;
}

export interface SubscriptionDTO {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  active: boolean;
  startedAt: Date | string;
  endsAt?: Date | string | null;
  meta?: any;
}
