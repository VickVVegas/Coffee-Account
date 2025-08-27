// app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

/**
 * API Reviews
 * - GET: lista reviews (com ?contentId= ou ?userId=)
 * - POST: cria uma nova review (user precisa estar logado)
 */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const contentId = searchParams.get("contentId");
    const userId = searchParams.get("userId");

    const where: any = {};
    if (contentId) where.contentId = contentId;
    if (userId) where.userId = userId;

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: { select: { id: true, name: true } },
        content: { select: { id: true, title: true, type: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (err) {
    console.error("reviews GET error:", err);
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

    const { contentId, rating, text, spoiler } = body as {
      contentId?: string;
      rating?: number;
      text?: string;
      spoiler?: boolean;
    };

    if (!contentId || rating == null || !text) {
      return NextResponse.json(
        { error: "Campos obrigatórios: contentId, rating, text" },
        { status: 400 }
      );
    }

    if (rating < 0 || rating > 10) {
      return NextResponse.json(
        { error: "Nota inválida (0–10)" },
        { status: 400 }
      );
    }

    const created = await prisma.review.create({
      data: {
        userId: session.user.id as string,
        contentId,
        rating,
        text,
        spoiler: spoiler ?? false,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("reviews POST error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
