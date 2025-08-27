// types/guide.ts
/**
 * Tipos compartilhados para Guias da Coffee Account
 * (baseados em prisma/schema.prisma e usados em APIs/UI)
 */

import { ContentDTO } from "./content";

export interface GuideInput {
  contentId: string;
  title: string;
  body: string; // markdown ou texto longo
}

export interface GuideDTO {
  id: string;
  user: {
    id: string;
    name: string | null;
    image?: string | null;
  };
  content: Pick<ContentDTO, "id" | "title" | "type">;
  title: string;
  body: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface GuideReactionDTO {
  id: string;
  guideId: string;
  userId: string;
  type: "LIKE" | "USEFUL" | "FAVORITE";
  createdAt: Date | string;
}
