// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth";

// Desestrutura os handlers tipados para o App Router
export const { GET, POST } = NextAuth(authConfig);
