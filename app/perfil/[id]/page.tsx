// app/perfil/[id]/page.tsx
import { cookies } from "next/headers";

/**
 * Página de Perfil do Usuário
 * - Mostra informações do usuário (mock inicial).
 * - Exibe Respeito, bio, coleções, reviews recentes.
 * - Tradução PT/EN baseada no cookie "lang".
 */

type Dict = {
  title: string;
  labels: {
    respect: string;
    collections: string;
    reviews: string;
    guides: string;
    bio: string;
    changeLang: string;
  };
};

function getDict(): Dict {
  const lang = cookies().get("lang")?.value?.toLowerCase();
  if (lang === "en") {
    return {
      title: "Profile",
      labels: {
        respect: "Respect",
        collections: "Collections",
        reviews: "Recent Reviews",
        guides: "Guides",
        bio: "About",
        changeLang: "Change language",
      },
    };
  }
  return {
    title: "Perfil",
    labels: {
      respect: "Respeito",
      collections: "Coleções",
      reviews: "Reviews recentes",
      guides: "Guias",
      bio: "Sobre",
      changeLang: "Trocar idioma",
    },
  };
}

// Mock de usuário
const mockUser = {
  id: "1",
  name: "Victoria",
  respect: 128,
  bio: "Diretora criativa da CoffeeChroma Studios ☕🚀.",
  collections: ["Top 5 CRPGs", "Filmes favoritos 2025"],
  reviews: [
    {
      content: "Christie",
      text: "Mistério genial com vibe retrô.",
      rating: 9,
    },
    {
      content: "Larmadio",
      text: "Drama de máfia impecável!",
      rating: 8,
    },
  ],
  guides: ["Guia do iniciante em Cosmic Coffee"],
};

export default function PerfilPage({ params }: { params: { id: string } }) {
  const t = getDict();
  const lang =
    cookies().get("lang")?.value?.toLowerCase() === "en" ? "en" : "pt";

  return (
    <section>
      <header style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#684e2f,#E0B25B)",
          }}
        />
        <div>
          <h1 style={{ fontSize: 24 }}>{mockUser.name}</h1>
          <p className="muted">{mockUser.bio}</p>
          <p style={{ marginTop: 6, fontSize: 14 }}>
            ⭐ {t.labels.respect}: <strong>{mockUser.respect}</strong>
          </p>
        </div>
      </header>

      {/* botão para trocar idioma */}
      <form
        action={`/perfil/${params.id}/change-lang`}
        method="post"
        style={{ marginBottom: 20 }}
      >
        <button
          type="submit"
          className="cta"
          style={{ fontSize: 13, padding: "6px 12px" }}
        >
          {t.labels.changeLang}: {lang === "en" ? "PT" : "EN"}
        </button>
      </form>

      <div style={{ display: "grid", gap: 20 }}>
        <section>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            {t.labels.collections}
          </h2>
          <ul className="bullets">
            {mockUser.collections.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>{t.labels.reviews}</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {mockUser.reviews.map((r, i) => (
              <article
                key={i}
                className="card"
                style={{
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: 12,
                  padding: 14,
                  background: "#121216",
                }}
              >
                <strong>{r.content}</strong>
                <p className="muted" style={{ marginTop: 4, marginBottom: 6 }}>
                  {r.text}
                </p>
                <span style={{ fontSize: 13 }}>⭐ {r.rating}/10</span>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>{t.labels.guides}</h2>
          <ul className="bullets">
            {mockUser.guides.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
