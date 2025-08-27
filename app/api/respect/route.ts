// app/api/respect/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { awardRespect, penalizeRespect, getUserRespect } from "@/lib/respect";

/**
 * API Respeito
 * - GET: retorna respeito atual do usuário logado (?userId= opcional para admin/debug)
 * - POST: concede ou remove respeito (apenas para eventos válidos)
 *
 * POST payload esperado:
 *   {
 *     "targetUserId": "id-do-usuario",
 *     "source": "REVIEW_USEFUL",
 *     "points": 6,
 *     "meta": { "reviewId": "abc" }
 *   }
 */

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || (session.user.id as string);

    const data = await getUserRespect(userId);
    return NextResponse.json(data);
  } catch (err) {
    console.error("respect GET error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const { targetUserId, source, points, meta } = body as {
      targetUserId?: string;
      source?: string;
      points?: number;
      meta?: Record<string, any>;
    };

    if (!targetUserId || !source || typeof points !== "number") {
      return NextResponse.json(
        { error: "Campos obrigatórios: targetUserId, source, points" },
        { status: 400 }
      );
    }

    let result;
    if (points >= 0) {
      result = await awardRespect(targetUserId, source, points, meta);
    } else {
      result = await penalizeRespect(targetUserId, source, points, meta);
    }

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("respect POST error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
