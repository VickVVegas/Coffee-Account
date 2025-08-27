// app/reviews/page.tsx
import { cookies } from "next/headers";

/**
 * Página Reviews
 * - Mostra lista de críticas da comunidade sobre conteúdos (jogos, filmes, livros).
 * - Permite filtrar por mídia.
 * - Tradução PT/EN baseada no cookie "lang".
 */

type Dict = {
  title: string;
  filters: { all: string; games: string; films: string; books: string };
  labels: { by: string; rating: string; reactions: string };
};

function getDict(): Dict {
  const lang = cookies().get("lang")?.value?.toLowerCase();
  if (lang === "en") {
    return {
      title: "Community Reviews",
      filters: { all: "All", games: "Games", films: "Films", books: "Books" },
      labels: { by: "by", rating: "Rating", reactions: "Reactions" },
    };
  }
  return {
    title: "Reviews da Comunidade",
    filters: { all: "Todos", games: "Jogos", films: "Filmes", books: "Livros" },
    labels: { by: "por", rating: "Nota", reactions: "Reações" },
  };
}

// Mock de reviews
const mockReviews = [
  {
    id: 1,
    user: "Ana",
    contentId: "christie",
    contentType: "game",
    contentTitle: "Christie",
    rating: 9,
    text: "Atmosfera incrível, puzzles envolventes, lembra um livro de mistério clássico.",
    likes: 14,
    useful: 8,
  },
  {
    id: 2,
    user: "Rafael",
    contentId: "larmadio",
    contentType: "film",
    contentTitle: "Larmadio",
    rating: 8,
    text: "Drama de máfia intenso, personagens marcantes e fotografia belíssima.",
    likes: 20,
    useful: 10,
  },
  {
    id: 3,
    user: "Lia",
    contentId: "livro-demo",
    contentType: "book",
    contentTitle: "Livro Exemplo",
    rating: 7,
    text: "Boa construção de mundo, mas ritmo irregular. Ainda assim, vale a leitura.",
    likes: 5,
    useful: 2,
  },
];

export default function ReviewsPage() {
  const t = getDict();

  return (
    <section>
      <h1 style={{ fontSize: 22, marginBottom: 18 }}>{t.title}</h1>

      {/* filtros */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <span className="chip active">{t.filters.all}</span>
        <span className="chip">{t.filters.games}</span>
        <span className="chip">{t.filters.films}</span>
        <span className="chip">{t.filters.books}</span>
      </div>

      {/* lista de reviews */}
      <div style={{ display: "grid", gap: 14 }}>
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
            <header style={{ marginBottom: 6 }}>
              <strong>{r.contentTitle}</strong>{" "}
              <span className="muted">
                ({r.contentType.toUpperCase()}) — {t.labels.by} {r.user}
              </span>
            </header>
            <p style={{ fontSize: 14, color: "#d0d2d6", marginBottom: 8 }}>
              {r.text}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                opacity: 0.8,
              }}
            >
              <span>
                {t.labels.rating}: <strong>{r.rating}/10</strong>
              </span>
              <span>
                {t.labels.reactions}: 👍 {r.likes} • 💡 {r.useful}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
