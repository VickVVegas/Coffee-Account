// types/content.ts
/**
 * Tipos compartilhados para Conteúdos na Coffee Account
 * (manter em sincronia com prisma/schema.prisma e lib/content.ts)
 */

export type Lang = "pt" | "en";

/** Tipos de mídia suportados */
export type ContentType = "GAME" | "FILM" | "BOOK" | "ALBUM" | "HQ" | "RPG";

/** Status do item na biblioteca do usuário */
export type LibraryStatus = "PLAYING" | "FINISHED" | "WISHLIST" | "DROPPED";

/** Payload de criação/edição de conteúdo (API/UI) */
export interface ContentInput {
  title: string;
  type: ContentType;
  description?: string | null;
  releaseDate?: Date | string | null; // permite string ISO no transporte
  slug?: string;
  coverUrl?: string | null;
}

/** Representação de conteúdo utilizada na UI/APIs */
export interface ContentDTO {
  id: string;
  slug: string;
  title: string;
  type: ContentType;
  description?: string | null;
  releaseDate?: Date | string | null;
  coverUrl?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/** Filtros comuns para listagem/busca de conteúdos */
export interface ContentFilter {
  q?: string; // busca textual (título/descrição/slug)
  types?: ContentType[]; // restringe por tipo
  onlyUpcoming?: boolean; // apenas com releaseDate > agora
}

/** Estrutura de cartão de conteúdo pronta para renderizar */
export interface ContentCardView {
  id: string;
  slug: string;
  title: string;
  type: ContentType;
  typeLabel: string; // rótulo i18n (“Jogo”, “Filme”, …)
  description: string; // resumo/preview já truncado
  releaseKey: "available" | "soon" | "preview";
  releaseLabel: string; // rótulo i18n correspondente
  coverUrl?: string | null;
}
