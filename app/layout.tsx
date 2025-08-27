// app/layout.tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";
import "@/styles/globals.css";

/**
 * Internacionalização (básica):
 * - Lê o cookie "lang" (valores esperados: "pt" | "en").
 * - Define <html lang="pt-BR" | "en"> para acessibilidade/SEO.
 * - A troca do idioma será feita na página de Perfil, que atualizará o cookie "lang".
 *   (Ex.: set-cookie: lang=pt  ou  lang=en)
 */

function resolveHtmlLang(): "pt-BR" | "en" {
  const c = cookies().get("lang")?.value?.toLowerCase();
  if (c === "en") return "en";
  return "pt-BR";
}

export const metadata: Metadata = {
  title: "Coffee Account • TEA",
  description:
    "Sua identidade CoffeeChroma para jogos, filmes, livros, música e Umbrelica.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const htmlLang = resolveHtmlLang();

  // Rótulos mínimos do header conforme idioma (placeholder).
  const t =
    htmlLang === "en"
      ? {
          brandSuffix: "• Coffee Account",
          profile: "My profile",
          nav: {
            novidades: "News",
            feed: "Feed",
            reviews: "Reviews",
            perfil: "Profile",
            assinaturas: "Subscriptions",
            amigos: "Friends",
            biblioteca: "Library",
          },
        }
      : {
          brandSuffix: "• Coffee Account",
          profile: "Meu perfil",
          nav: {
            novidades: "Novidades",
            feed: "Feed",
            reviews: "Reviews",
            perfil: "Perfil",
            assinaturas: "Assinaturas",
            amigos: "Amigos",
            biblioteca: "Biblioteca",
          },
        };

  return (
    <html lang={htmlLang}>
      <body>
        {/* Header fixo no topo com a identidade TEA/Coffee */}
        <header className="hdr">
          <div className="wrap brand">
            <div className="logo" aria-hidden />
            <strong className="tea">TEA</strong>
            <span className="muted">{t.brandSuffix}</span>

            {/* Navegação principal (links de exemplo; ajuste rotas conforme implementar) */}
            <nav
              aria-label={
                htmlLang === "en" ? "Main navigation" : "Navegação principal"
              }
              style={{
                marginLeft: "auto",
                display: "flex",
                gap: "14px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <a className="navlink" href="/novidades">
                {t.nav.novidades}
              </a>
              <a className="navlink" href="/feed">
                {t.nav.feed}
              </a>
              <a className="navlink" href="/reviews">
                {t.nav.reviews}
              </a>
              <a className="navlink" href="/perfil/me">
                {t.nav.perfil}
              </a>
              <a className="navlink" href="/assinaturas">
                {t.nav.assinaturas}
              </a>
              <a className="navlink" href="/amigos">
                {t.nav.amigos}
              </a>
              <a className="navlink" href="/biblioteca">
                {t.nav.biblioteca}
              </a>

              {/* Indicador de idioma atual (a troca real será feita na página de Perfil) */}
              <span
                className="lang-pill"
                title={
                  htmlLang === "en"
                    ? "Language set by your profile (change in Profile)"
                    : "Idioma definido pelo seu perfil (altere em Perfil)"
                }
              >
                {htmlLang === "en" ? "EN" : "PT"}
              </span>
            </nav>
          </div>
        </header>

        {/* Conteúdo das páginas */}
        <main className="wrap" style={{ paddingTop: 22 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
