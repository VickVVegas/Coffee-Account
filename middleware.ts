// middleware.ts
export { default } from "next-auth/middleware";

/**
 * Protege rotas que exigem usuário autenticado.
 * - Público: /, /novidades, /reviews, /conteudo/[id], /guias/[id]
 * - Privado: /account, /amigos, /biblioteca, /perfil/me
 *
 * Obs.: Se quiser tornar mais páginas privadas (ex.: /feed),
 * basta adicioná-las ao matcher.
 */
export const config = {
  matcher: [
    "/account/:path*",
    "/amigos/:path*",
    "/biblioteca/:path*",
    "/perfil/me",
  ],
};
