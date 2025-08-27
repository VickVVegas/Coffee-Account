// app/api/notifications/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * API Notifications
 * - GET: lista notificações do usuário logado
 * - POST: cria uma notificação (futuro: restrito a sistema/admin)
 * - PATCH: marca notificações como lidas
 */

export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const notes = await prisma.notification.findMany({
      where: { userId: session.user.id as string },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(notes);
  } catch (err) {
    console.error("notifications GET error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // futuramente: validar admin/system
    const body = await req.json().catch(() => null);
    if (!body?.userId || !body?.title) {
      return NextResponse.json(
        { error: "Campos obrigatórios: userId, title" },
        { status: 400 }
      );
    }

    const note = await prisma.notification.create({
      data: {
        userId: body.userId,
        title: body.title,
        body: body.body ?? null,
        linkUrl: body.linkUrl ?? null,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (err) {
    console.error("notifications POST error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const ids: string[] | undefined = body?.ids;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "ids obrigatórios (array)" },
        { status: 400 }
      );
    }

    await prisma.notification.updateMany({
      where: {
        userId: session.user.id as string,
        id: { in: ids },
      },
      data: { read: true },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("notifications PATCH error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
