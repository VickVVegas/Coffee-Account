// types/library.ts
/**
 * Tipos compartilhados para Biblioteca do usuário (LibraryItem)
 * (baseados em prisma/schema.prisma e usados em APIs/UI)
 */

import { ContentDTO } from "./content";

export type LibraryStatus = "PLAYING" | "FINISHED" | "WISHLIST" | "DROPPED";

export interface LibraryInput {
  contentId: string;
  status: LibraryStatus;
  notes?: string;
  tags?: string; // CSV simples; no futuro pode virar array
}

export interface LibraryItemDTO {
  id: string;
  userId: string;
  contentId: string;
  status: LibraryStatus;
  notes?: string | null;
  tags?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  content?: Pick<ContentDTO, "id" | "title" | "type" | "coverUrl">;
}
