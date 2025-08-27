// app/api/library/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * API Biblioteca
 * - GET: lista biblioteca do usuário logado (ou ?userId=)
 * - POST: adiciona/atualiza item na biblioteca
 * - DELETE: remove item da biblioteca
 *
 * POST payload:
 *   {
 *     "contentId": "id-do-conteudo",
 *     "status": "PLAYING" | "FINISHED" | "WISHLIST" | "DROPPED"
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

    const items = await prisma.libraryItem.findMany({
      where: { userId },
      include: {
        content: {
          select: { id: true, title: true, type: true, coverUrl: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(items);
  } catch (err) {
    console.error("library GET error:", err);
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
    const { contentId, status } = body || {};

    if (!contentId || !status) {
      return NextResponse.json(
        { error: "Campos obrigatórios: contentId, status" },
        { status: 400 }
      );
    }

    const item = await prisma.libraryItem.upsert({
      where: {
        userId_contentId: {
          userId: session.user.id as string,
          contentId,
        },
      },
      update: { status },
      create: {
        userId: session.user.id as string,
        contentId,
        status,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("library POST error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const { contentId } = body || {};

    if (!contentId) {
      return NextResponse.json(
        { error: "contentId obrigatório" },
        { status: 400 }
      );
    }

    await prisma.libraryItem.deleteMany({
      where: {
        userId: session.user.id as string,
        contentId,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("library DELETE error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
