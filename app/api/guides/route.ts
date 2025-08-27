// app/api/guides/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

/**
 * API Guides (Guias da comunidade)
 * - GET: lista guias (?contentId= ou ?userId=)
 * - POST: cria um guia (user precisa estar logado)
 */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const contentId = searchParams.get("contentId");
    const userId = searchParams.get("userId");

    const where: any = {};
    if (contentId) where.contentId = contentId;
    if (userId) where.userId = userId;

    const guides = await prisma.guide.findMany({
      where,
      include: {
        user: { select: { id: true, name: true } },
        content: { select: { id: true, title: true, type: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(guides);
  } catch (err) {
    console.error("guides GET error:", err);
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

    const {
      contentId,
      title,
      body: text,
    } = body as {
      contentId?: string;
      title?: string;
      body?: string;
    };

    if (!contentId || !title || !text) {
      return NextResponse.json(
        { error: "Campos obrigatórios: contentId, title, body" },
        { status: 400 }
      );
    }

    const created = await prisma.guide.create({
      data: {
        userId: session.user.id as string,
        contentId,
        title,
        body: text,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("guides POST error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
