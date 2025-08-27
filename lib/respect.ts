// lib/respect.ts
import { prisma } from "@/lib/prisma";

/**
 * Sistema de "Respeito" (reputação) da Coffee Account
 * ---------------------------------------------------
 * Conceitos:
 * - Respeito é um inteiro acumulado por usuário.
 * - Eventos (RespectEvent) registram cada ganho/perda com source e meta.
 * - Caps/dia por origem evitam farm.
 * - Decaimento mensal opcional mantém a reputação “viva”.
 *
 * Como usar (exemplos):
 *  await awardRespect(userId, "REVIEW_USEFUL", 6, { reviewId });
 *  await awardRespect(userId, "REVIEW_LIKE", 2, { reviewId });
 *  await penalizeRespect(userId, "MODERATION_REMOVAL",  -20, { reviewId });
 *  await applyMonthlyDecay(0.05); // 5% de decaimento
 */

// ============================
// Configurações e constantes
// ============================

/** Pontuação sugerida por evento (ajuste conforme tuning) */
export const DEFAULT_POINTS: Record<string, number> = {
  REVIEW_USEFUL: 6,
  REVIEW_LIKE: 2,
  REVIEW_FAVORITE: 8,
  GUIDE_USEful: 8, // “USEful” maiúsculo/minúsculo é irrelevante; use .toUpperCase()
  GUIDE_LIKE: 2,
  COMMENT_UPVOTE: 1,
  NEW_FOLLOWER: 1,
  EDITOR_FEATURED: 20,
  COMMUNITY_MILESTONE: 50,
  // Penalidades
  MODERATION_REMOVAL: -10,
};

/** Cap diário por origem (para anti-farm). Ex.: no máximo 60 pts/dia de REVIEW_LIKE. */
export const DAILY_CAP_BY_SOURCE: Record<string, number> = {
  REVIEW_LIKE: 60,
  REVIEW_USEFUL: 120,
  REVIEW_FAVORITE: 120,
  GUIDE_LIKE: 60,
  GUIDE_USEFUL: 120,
  COMMENT_UPVOTE: 40,
  NEW_FOLLOWER: 20,
  EDITOR_FEATURED: 100, // raro, mas impede empilhamento acidental
  COMMUNITY_MILESTONE: 200,
  MODERATION_REMOVAL: 9999, // penalidade não capamos
};

/** Fator de peso por qualidade do avaliador (autor do like/útil com respeito alto conta mais) */
export function qualityWeight(respect: number): number {
  if (respect >= 500) return 1.25;
  if (respect >= 200) return 1.1;
  return 1.0;
}

/** Níveis por faixas de respeito (para badge/visual) */
export function getRespectLevel(
  respect: number
): "Bronze" | "Prata" | "Ouro" | "Platina" | "Ébano" {
  if (respect >= 2000) return "Ébano";
  if (respect >= 1000) return "Platina";
  if (respect >= 500) return "Ouro";
  if (respect >= 200) return "Prata";
  return "Bronze";
}

// ============================
// Utilitários internos
// ============================

function todayRangeUTC() {
  const now = new Date();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)
  );
  const end = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );
  return { start, end };
}

/** Normaliza chave de origem */
function norm(source: string) {
  return source.trim().toUpperCase();
}

/** Retorna total já ganho hoje por essa origem (>=0, penalidades não contam para cap) */
async function earnedTodayBySource(userId: string, sourceKey: string) {
  const { start, end } = todayRangeUTC();
  const total = await prisma.respectEvent.aggregate({
    where: {
      userId,
      source: sourceKey,
      points: { gt: 0 },
      createdAt: { gte: start, lte: end },
    },
    _sum: { points: true },
  });
  return total._sum.points ?? 0;
}

// ============================
// API pública
// ============================

/**
 * Concede (ou remove) respeito para um usuário e grava RespectEvent.
 * - Aplica cap diário por origem (se configurado).
 * - Usa transação para manter consistência entre User.respect e RespectEvent.
 * - Retorna { appliedPoints, capped }.
 */
export async function awardRespect(
  userId: string,
  source: string,
  rawPoints: number,
  meta?: Record<string, any>
): Promise<{ appliedPoints: number; capped: boolean }> {
  const sourceKey = norm(source);
  let points = Math.trunc(rawPoints); // sempre inteiro

  // Cap diário (somente para ganhos > 0)
  let capped = false;
  if (points > 0 && DAILY_CAP_BY_SOURCE[sourceKey] != null) {
    const cap = DAILY_CAP_BY_SOURCE[sourceKey];
    const earned = await earnedTodayBySource(userId, sourceKey);
    const remaining = Math.max(0, cap - earned);
    if (remaining <= 0) {
      // já atingiu cap do dia
      return { appliedPoints: 0, capped: true };
    }
    if (points > remaining) {
      points = remaining;
      capped = true;
    }
  }

  if (points === 0) {
    return { appliedPoints: 0, capped };
  }

  // Transação: cria evento e atualiza contagem do usuário
  await prisma.$transaction(async (tx) => {
    await tx.respectEvent.create({
      data: {
        userId,
        source: sourceKey,
        points,
        meta: meta as any,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: { respect: { increment: points } },
    });
  });

  return { appliedPoints: points, capped };
}

/**
 * Penalização utilitária (alias para awardRespect com pontos negativos).
 */
export async function penalizeRespect(
  userId: string,
  source: string,
  negativePoints: number,
  meta?: Record<string, any>
) {
  const pts = Math.abs(negativePoints) * -1;
  return awardRespect(userId, source, pts, meta);
}

/**
 * Aplica decaimento percentual a todos os usuários.
 * - Ex.: applyMonthlyDecay(0.05) => -5%
 * - Ideal rodar via cron mensal.
 * - Retorna número de usuários afetados.
 */
export async function applyMonthlyDecay(percent: number): Promise<number> {
  const p = Math.max(0, Math.min(percent, 1));

  // Busque usuários com respeito > 0 para decair
  const users = await prisma.user.findMany({
    where: { respect: { gt: 0 } },
    select: { id: true, respect: true },
  });

  if (users.length === 0) return 0;

  // Execute em transação: cria evento negativo e atualiza respeito
  await prisma.$transaction(
    users.map((u) => {
      const decay = -Math.max(1, Math.floor(u.respect * p)); // ao menos -1 se tiver respeito
      return prisma.$transaction([
        prisma.respectEvent.create({
          data: {
            userId: u.id,
            source: "MONTHLY_DECAY",
            points: decay,
          },
        }),
        prisma.user.update({
          where: { id: u.id },
          data: { respect: { increment: decay } },
        }),
      ]);
    }),
    { timeout: 60000 }
  );

  return users.length;
}

/**
 * Calcula e concede respeito baseado em reações de uma review.
 * - Útil (peso maior), Favorito, Like.
 * - Considera peso pela qualidade do avaliador.
 * - Recebe o respeito atual do avaliador para aplicar weight (evita query extra).
 */
export async function awardFromReviewReaction(
  reviewAuthorId: string,
  reactionType: "LIKE" | "USEFUL" | "FAVORITE",
  reactorRespect: number,
  reviewId: string
) {
  const s = `REVIEW_${reactionType}`;
  const base =
    DEFAULT_POINTS[s] ??
    (reactionType === "USEFUL" ? 6 : reactionType === "FAVORITE" ? 8 : 2);

  const w = qualityWeight(reactorRespect);
  const points = Math.round(base * w);

  return awardRespect(reviewAuthorId, s, points, { reviewId, w });
}

/**
 * Lê o respeito atual e o nível calculado.
 */
export async function getUserRespect(
  userId: string
): Promise<{ respect: number; level: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { respect: true },
  });
  const respect = user?.respect ?? 0;
  return { respect, level: getRespectLevel(respect) };
}

/**
 * Dá um boost manual (admin/editor) para destaques editoriais.
 * - Útil para “Editor’s Pick”, concursos, eventos sazonais, etc.
 */
export async function editorsPickBoost(
  userId: string,
  points = DEFAULT_POINTS.EDITOR_FEATURED
) {
  return awardRespect(userId, "EDITOR_FEATURED", points, {
    reason: "editors_pick",
  });
}

/**
 * Adiciona pontos por marco de comunidade (ex.: “100 reviews > 80% úteis”).
 */
export async function communityMilestone(
  userId: string,
  key: string,
  points = DEFAULT_POINTS.COMMUNITY_MILESTONE
) {
  return awardRespect(userId, "COMMUNITY_MILESTONE", points, {
    milestone: key,
  });
}
