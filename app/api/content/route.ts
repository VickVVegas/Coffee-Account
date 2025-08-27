// app/api/content/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildSlug, sanitizeContentInput } from "@/lib/content";

/**
 * API de Conteúdos (Content)
 * Métodos:
 *  - GET: lista todos os conteúdos ou busca por ?q= e ?type=
 *  - POST: cria um novo conteúdo (apenas admins futuramente)
 *
 * Obs.: Por enquanto sem autenticação/role check, apenas mock inicial.
 */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim().toLowerCase();
    const type = searchParams.get("type")?.toUpperCase();

    const where: any = {};
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { slug: { contains: buildSlug(q), mode: "insensitive" } },
      ];
    }
    if (type) where.type = type;

    const list = await prisma.content.findMany({
      where,
      orderBy: [{ releaseDate: "asc" }, { title: "asc" }],
    });

    return NextResponse.json(list);
  } catch (err) {
    console.error("content GET error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const input = sanitizeContentInput(body);
    if (!input.title || !input.type) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes" },
        { status: 400 }
      );
    }

    const slug = input.slug?.trim() || buildSlug(input.title);

    const created = await prisma.content.create({
      data: {
        title: input.title,
        type: input.type,
        description: input.description ?? null,
        releaseDate: input.releaseDate ? new Date(input.releaseDate) : null,
        coverUrl: input.coverUrl ?? null,
        slug,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("content POST error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
