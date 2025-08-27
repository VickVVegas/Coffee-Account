// app/api/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

/**
 * Registro de usuário (Credentials)
 * Espera JSON: { name?: string, email: string, password: string }
 * - E-mail único (case-insensitive)
 * - Senha com hash (bcrypt 12 rounds)
 * - Define lang inicial a partir do cookie "lang" (pt/en), padrão "pt"
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    let { name, email, password } = body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Campos obrigatórios" },
        { status: 400 }
      );
    }

    email = String(email).trim().toLowerCase();
    name = name ? String(name).trim() : null;

    // Validações simples
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
    }
    if (String(password).length < 6) {
      return NextResponse.json(
        { error: "Senha muito curta (mín. 6)" },
        { status: 400 }
      );
    }

    // Checa duplicidade
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { error: "E-mail já registrado" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // idioma inicial baseado no cookie "lang"
    const cookieLang = cookies().get("lang")?.value?.toLowerCase();
    const lang = cookieLang === "en" ? "en" : "pt";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        lang,
      },
      select: { id: true, email: true, name: true, lang: true },
    });

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (err) {
    console.error("register POST error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
