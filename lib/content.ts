// lib/content.ts

/**
 * Utilitários para lidar com conteúdos multimídia da Coffee Account
 * (jogos, filmes, livros, álbuns, HQs, RPGs).
 *
 * Este módulo NÃO depende do Prisma Client por padrão para evitar ciclos.
 * Caso precise fazer queries, passe o prisma como argumento nas funções
 * auxiliares que aceitam um client genérico.
 */

// === Tipos e enums locais (espelham o schema.prisma) ========================

export type Lang = "pt" | "en";

export type ContentType =
  | "GAME"
  | "FILM"
  | "BOOK"
  | "ALBUM"
  | "HQ"
  | "RPG";

export type LibraryStatus = "PLAYING" | "FINISHED" | "WISHLIST" | "DROPPED";

// Rótulos por tipo (PT/EN)
const TYPE_LABELS: Record<ContentType, { pt: string; en: string }> = {
  GAME: { pt: "Jogo", en: "Game" },
  FILM: { pt: "Filme", en: "Film" },
  BOOK: { pt: "Livro", en: "Book" },
  ALBUM: { pt: "Álbum", en: "Album" },
  HQ: { pt: "HQ", en: "Comic" },
  RPG: { pt: "RPG", en: "RPG" },
};

// Badges/cor sugestiva por tipo (para UI)
export const TYPE_BADGE: Record<
  ContentType,
  { hue: number; text: string } // hue HSL; text = rótulo curto PT
> = {
  GAME: { hue: 220, text: "Jogo" },
  FILM: { hue: 30, text: "Filme" },
  BOOK: { hue: 150, text: "Livro" },
  ALBUM: { hue: 270, text: "Álbum" },
  HQ: { hue: 0, text: "HQ" },
  RPG: { hue: 195, text: "RPG" },
};

// === Helpers de i18n ========================================================

export function getTypeLabel(type: ContentType, lang: Lang = "pt"): string {
  const t = TYPE_LABELS[type];
  return lang === "en" ? t.en : t.pt;
}

export function getLibraryStatusLabel(
  status: LibraryStatus,
  lang: Lang = "pt",
): string {
  const map: Record<LibraryStatus, { pt: string; en: string }> = {
    PLAYING: { pt: "Jogando/Lendo", en: "Playing/Reading" },
    FINISHED: { pt: "Finalizado", en: "Finished" },
    WISHLIST: { pt: "Lista de desejos", en: "Wishlist" },
    DROPPED: { pt: "Abandonado", en: "Dropped" },
  };
  const t = map[status];
  return lang === "en" ? t.en : t.pt;
}

/**
 * Retorna um rótulo de disponibilidade baseado na data de lançamento.
 * - Antes de hoje: "Disponível" / "Available"
 * - Hoje ou até +30d: "Em breve" / "Coming soon"
 * - Após +30d: "Prévia" / "Preview"
 */
export function getReleaseBadge(
  releaseDate: Date | null | undefined,
  lang: Lang = "pt",
): { key: "available" | "soon" | "preview"; label: string } {
  const now = new Date();
  if (!releaseDate) {
    return {
      key: "preview",
      label: lang === "en" ? "Preview" : "Prévia",
    };
  }
  const d = new Date(releaseDate);
  if (d <= now) {
    return {
      key: "available",
      label: lang === "en" ? "Available" : "Disponível",
    };
  }
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / 86400000);
  if (diffDays <= 30) {
    return { key: "soon", label: lang === "en" ? "Coming soon" : "Em breve" };
  }
  return { key: "preview", label: lang === "en" ? "Preview" : "Prévia" };
}

// === Helpers de texto/slug ===================================================

/** Cria um slug URL-safe a partir de um título. */
export function buildSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/** Limita um texto a N caracteres preservando palavras. */
export function summarize(text: string, max = 140): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const out = clean.slice(0, max);
  const lastSpace = out.lastIndexOf(" ");
  return `${out.slice(0, lastSpace > 0 ? lastSpace : max)}…`;
}

/** Sanitiza campos básicos de conteúdo antes de salvar. */
export function sanitizeContentInput<T extends Partial<ContentInput>>(
  input: T,
): T {
  const o = { ...input };
  if (o.title) o.title = o.title.trim();
  if (o.description) o.description = o.description.trim();
  if (o.slug) o.slug = buildSlug(o.slug);
  return o;
}

// === Formatos de dados usados na UI/APIs ====================================

export type ContentInput = {
  title: string;
  type: ContentType;
  description?: string | null;
  releaseDate?: Date | null;
  slug?: string;
  coverUrl?: string | null;
};

export type ContentDTO = {
  id: string;
  slug: string;
  title: string;
  type: ContentType;
  description?: string | null;
  releaseDate?: Date | null;
  coverUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

// Mapeia um ContentDTO para dados de cartão de UI (labels e badges prontos)
export function toCardView(
  c: ContentDTO,
  lang: Lang = "pt",
): {
  id: string;
  title: string;
  typeLabel: string;
  type: ContentType;
  slug: string;
  description: string;
  releaseLabel: string;
  releaseKey: "available" | "soon" | "preview";
  coverUrl?: string | null;
} {
  const { key, label } = getReleaseBadge(c.releaseDate || undefined, lang);
  return {
    id: c.id,
    title: c.title,
    typeLabel: getTypeLabel(c.type, lang),
    type: c.type,
    slug: c.slug,
    description: summarize(c.description || ""),
    releaseLabel: label,
    releaseKey: key,
    coverUrl: c.coverUrl ?? null,
  };
}

// === Filtros/ordenadores úteis ==============================================

export type ContentFilter = {
  q?: string; // busca por título
  types?: ContentType[]; // filtrar por tipos
  onlyUpcoming?: boolean; // apenas lançamentos futuros
};

export function filterContents<T extends ContentDTO>(
  list: T[],
  filter: ContentFilter = {},
): T[] {
  const q = filter.q?.trim().toLowerCase();
  const now = new Date();

  return list.filter((c) => {
    if (filter.types && filter.types.length > 0 && !filter.types.includes(c.type))
      return false;
    if (typeof q === "string" && q.length > 0) {
      const hay =
        `${c.title} ${c.description ?? ""} ${c.slug}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filter.onlyUpcoming) {
      if (!c.releaseDate) return false;
      if (new Date(c.releaseDate) <= now) return false;
    }
    return true;
  });
}

export function sortByReleaseAsc<T extends ContentDTO>(list: T[]): T[] {
  return [...list].sort((a, b) => {
    const da = a.releaseDate ? new Date(a.releaseDate).getTime() : Infinity;
    const db = b.releaseDate ? new Date(b.releaseDate).getTime() : Infinity;
    return da - db;
  });
}

export function sortByTitleAsc<T extends ContentDTO>(list: T[]): T[] {
  return [...list].sort((a, b) => a.title.localeCompare(b.title));
}

// === Integração opcional com Prisma (sem import fixo) =======================

/**
 * Busca conteúdos do banco (se desejar, passe o Prisma Client como arg).
 * Não tipamos o client para evitar dependência direta; use `any`.
 */
export async function listContentsFromDB(
  prisma: any,
  filter: ContentFilter = {},
): Promise<ContentDTO[]> {
  const where: any = {};
  if (filter.types?.length) where.type = { in: filter.types };
  if (filter.q && filter.q.trim()) {
    where.OR = [
      { title: { contains: filter.q, mode: "insensitive" } },
      { description: { contains: filter.q, mode: "insensitive" } },
      { slug: { contains: buildSlug(filter.q), mode: "insensitive" } },
    ];
  }
  if (filter.onlyUpcoming) {
    where.releaseDate = { gt: new Date() };
  }

  const rows = (await prisma.content.findMany({
    where,
    orderBy: [{ releaseDate: "asc" }, { title: "asc" }],
  })) as ContentDTO[];

  return rows;
}

/**
 * Cria um conteúdo no banco aplicando saneamento básico e slug automático.
 */
export async function createContentInDB(
  prisma: any,
  input: ContentInput,
): Promise<ContentDTO> {
  const data = sanitizeContentInput(input);
  const slug = data.slug?.trim() || buildSlug(data.title);
  const created = await prisma.content.create({
    data: {
      title: data.title,
      type: data.type,
      description: data.description ?? null,
      releaseDate: data.releaseDate ?? null,
      coverUrl: data.coverUrl ?? null,
      slug,
    },
  });
  return created as ContentDTO;
}

/**
 * Atualiza um conteúdo (parcial) garantindo slug consistente.
 */
export async function updateContentInDB(
  prisma: any,
  id: string,
  patch: Partial<ContentInput>,
): Promise<ContentDTO> {
  const data = sanitizeContentInput(patch);
  const updated = await prisma.content.update({
    where: { id },
    data: {
      ...(data.title != null ? { title: data.title } : {}),
      ...(data.type != null ? { type: data.type } : {}),
      ...(data.description !== undefined
        ? { description: data.description ?? null }
        : {}),
      ...(data.releaseDate !== undefined
        ? { releaseDate: data.releaseDate ?? null }
        : {}),
      ...(data.coverUrl !== undefined ? { coverUrl: data.coverUrl ?? null } : {}),
      ...(data.slug != null
        ? { slug: data.slug.trim() || buildSlug(data.title || "") }
        : {}),
    },
  });
  return updated as ContentDTO;
}
