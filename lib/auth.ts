// lib/auth.ts
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

/**
 * Configuração do NextAuth (v5 beta) para Coffee Account
 * - Provider: Credentials (email/senha) usando Prisma + bcrypt.
 * - Sessão via JWT (sem adapter neste estágio).
 * - Callbacks acrescentam campos extras no token/sessão (id, lang, respect).
 *
 * Observação:
 * - Se no futuro você quiser OAuth (Google/Discord) ou sessões persistidas,
 *   habilite os modelos de Adapter no schema.prisma e adicione os providers.
 */

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const ok = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!ok) return null;

        // Campos mínimos que entram no JWT
        return {
          id: user.id,
          name: user.name ?? user.email,
          email: user.email,
          image: user.image ?? undefined,
          lang: user.lang,
          respect: user.respect,
        } as any;
      },
    }),
  ],

  session: { strategy: "jwt" },
  trustHost: true,

  callbacks: {
    /**
     * JWT callback
     * - Na primeira vez (login), copia campos do user para o token.
     * - Em chamadas seguintes, mantém valores existentes.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.lang = (user as any).lang ?? "pt";
        token.respect = (user as any).respect ?? 0;
      }
      return token;
    },

    /**
     * Session callback
     * - Expõe no session.user os campos extras (id, lang, respect).
     */
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token as any).id ?? null;
        (session.user as any).lang = (token as any).lang ?? "pt";
        (session.user as any).respect = (token as any).respect ?? 0;
      }
      return session;
    },
  },
};
