// app/api/follow/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * API Follow
 * - GET: lista seguidores e seguidos do usuário logado (ou ?userId=)
 * - POST: seguir outro usuário
 * - DELETE: deixar de seguir
 *
 * POST payload:
 *   { "targetUserId": "id-do-usuario" }
 */

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || (session.user.id as string);

    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: { follower: { select: { id: true, name: true } } },
    });
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: { following: { select: { id: true, name: true } } },
    });

    return NextResponse.json({
      userId,
      followers: followers.map((f) => f.follower),
      following: following.map((f) => f.following),
    });
  } catch (err) {
    console.error("follow GET error:", err);
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
    const targetUserId = body?.targetUserId as string | undefined;

    if (!targetUserId) {
      return NextResponse.json(
        { error: "targetUserId obrigatório" },
        { status: 400 }
      );
    }
    if (targetUserId === session.user.id) {
      return NextResponse.json(
        { error: "Não é possível seguir a si mesmo" },
        { status: 400 }
      );
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id as string,
          followingId: targetUserId,
        },
      },
    });
    if (existing) {
      return NextResponse.json({ error: "Já está seguindo" }, { status: 400 });
    }

    const follow = await prisma.follow.create({
      data: {
        followerId: session.user.id as string,
        followingId: targetUserId,
      },
    });

    return NextResponse.json(follow, { status: 201 });
  } catch (err) {
    console.error("follow POST error:", err);
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
    const targetUserId = body?.targetUserId as string | undefined;

    if (!targetUserId) {
      return NextResponse.json(
        { error: "targetUserId obrigatório" },
        { status: 400 }
      );
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id as string,
          followingId: targetUserId,
        },
      },
    });
    if (!existing) {
      return NextResponse.json({ error: "Não está seguindo" }, { status: 400 });
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: session.user.id as string,
          followingId: targetUserId,
        },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("follow DELETE error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
