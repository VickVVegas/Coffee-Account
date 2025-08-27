// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

/**
 * Augmenta os tipos do NextAuth para incluir campos extras
 * que usamos no Coffee Account: id, lang e respect.
 *
 * Compatível com NextAuth v5 (beta) usando sessão via JWT.
 */

declare module "next-auth" {
  interface Session {
    user: {
      id: string | null;
      lang: "pt" | "en";
      respect: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    lang: "pt" | "en";
    respect: number;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    lang?: "pt" | "en";
    respect?: number;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
  }
}

export {};
