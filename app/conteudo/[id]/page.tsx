// app/conteudo/[id]/page.tsx
import { cookies } from "next/headers";

/**
 * Página de Conteúdo
 * - Exibe detalhes de um item (jogo, filme, livro, álbum, HQ, RPG).
 * - Mostra descrição, status, reviews e botão seguir/adicionar à biblioteca.
 * - Tradução PT/EN baseada no cookie "lang".
 */

type Dict = {
  follow: string;
  addLibrary: string;
  reviews: string;
  description: string;
};

function getDict(): Dict {
  const lang = cookies().get("lang")?.value?.toLowerCase();
  if (lang === "en") {
    return {
      follow: "Follow",
      addLibrary: "Add to Library",
      reviews: "Community Reviews",
      description: "Description",
    };
  }
  return {
    follow: "Seguir",
    addLibrary: "Adicionar à Biblioteca",
    reviews: "Reviews da Comunidade",
    description: "Descrição",
  };
}

// Mock de conteúdos
const mockContents: Record<
  string,
  { id: string; type: string; title: string; desc: string; date: string }
> = {
  christie: {
    id: "christie",
    type: "game",
    title: "Christie",
    desc: "Pixel art investigativo inspirado em Agatha Christie.",
    date: "2026",
  },
  larmadio: {
    id: "larmadio",
    type: "film",
    title: "Larmadio",
    desc: "Drama de máfia sobre lealdade e traição.",
    date: "2026",
  },
  "livro-demo": {
    id: "livro-demo",
    type: "book",
    title: "Livro Exemplo",
    desc: "Obra literária CoffeeChroma — placeholder para futuros livros.",
    date: "2026",
  },
};

const mockReviews = [
  { id: 1, user: "Ana", text: "Atmosfera incrível!", rating: 9 },
  { id: 2, user: "Victor", text: "Belo trabalho narrativo.", rating: 8 },
];

export default function ConteudoPage({ params }: { params: { id: string } }) {
  const t = getDict();
  const content = mockContents[params.id];

  if (!content) {
    return (
      <section>
        <h1>404</h1>
        <p>Conteúdo não encontrado.</p>
      </section>
    );
  }

  return (
    <section>
      <header style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 24 }}>{content.title}</h1>
        <p className="muted">
          {content.type.toUpperCase()} • {content.date}
        </p>
      </header>

      <article
        className="card"
        style={{
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 12,
          padding: 16,
          background: "#121216",
          marginBottom: 20,
        }}
      >
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>{t.description}</h2>
        <p style={{ fontSize: 14, color: "#d0d2d6" }}>{content.desc}</p>

        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
          <button className="cta">{t.follow}</button>
          <button
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,.08)",
              background: "#1a1a1e",
              color: "#eaeaf2",
              fontSize: 14,
            }}
          >
            {t.addLibrary}
          </button>
        </div>
      </article>

      <section>
        <h2 style={{ fontSize: 18, marginBottom: 10 }}>{t.reviews}</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {mockReviews.map((r) => (
            <article
              key={r.id}
              className="card"
              style={{
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 12,
                padding: 14,
                background: "#121216",
              }}
            >
              <header style={{ fontWeight: 600 }}>{r.user}</header>
              <p style={{ fontSize: 14, color: "#d0d2d6", margin: "6px 0" }}>
                {r.text}
              </p>
              <span style={{ fontSize: 13 }}>⭐ {r.rating}/10</span>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
