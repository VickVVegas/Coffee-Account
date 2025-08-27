// types/review.ts
/**
 * Tipos compartilhados para Reviews na Coffee Account
 * (baseados em prisma/schema.prisma e usados em APIs/UI)
 */

import { ContentDTO } from "./content";

export interface ReviewInput {
  contentId: string;
  rating: number; // 0–10
  text: string;
  spoiler?: boolean;
}

export interface ReviewDTO {
  id: string;
  user: {
    id: string;
    name: string | null;
    image?: string | null;
  };
  content: Pick<ContentDTO, "id" | "title" | "type">;
  rating: number;
  text: string;
  spoiler: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface ReviewReactionDTO {
  id: string;
  reviewId: string;
  userId: string;
  type: "LIKE" | "USEFUL" | "FAVORITE";
  createdAt: Date | string;
}
