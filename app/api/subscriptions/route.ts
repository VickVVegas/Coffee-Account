// app/api/subscriptions/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * API Subscriptions (Assinaturas TEA)
 * - GET: retorna assinatura(s) do usuário logado
 * - POST: cria ou atualiza assinatura
 * - DELETE: cancela assinatura
 *
 * POST payload:
 *   {
 *     "plan": "INDIVIDUAL" | "DUO_PLUS" | "FAMILY_PLUS" | "MANTIKORA",
 *     "endsAt"?: "2026-01-01T00:00:00Z"
 *   }
 */

export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const subs = await prisma.subscription.findMany({
      where: { userId: session.user.id as string, active: true },
      orderBy: { startedAt: "desc" },
    });

    return NextResponse.json(subs);
  } catch (err) {
    console.error("subscriptions GET error:", err);
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
    const { plan, endsAt } = body || {};

    if (!plan) {
      return NextResponse.json(
        { error: "Campo obrigatório: plan" },
        { status: 400 }
      );
    }

    // encerra assinaturas ativas anteriores
    await prisma.subscription.updateMany({
      where: { userId: session.user.id as string, active: true },
      data: { active: false },
    });

    const sub = await prisma.subscription.create({
      data: {
        userId: session.user.id as string,
        plan,
        active: true,
        endsAt: endsAt ? new Date(endsAt) : null,
      },
    });

    return NextResponse.json(sub, { status: 201 });
  } catch (err) {
    console.error("subscriptions POST error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await prisma.subscription.updateMany({
      where: { userId: session.user.id as string, active: true },
      data: { active: false, endsAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("subscriptions DELETE error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
