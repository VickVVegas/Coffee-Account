// app/novidades/page.tsx
import { cookies } from "next/headers";

/**
 * Página de Novidades
 * - Lista de lançamentos e destaques (Jogos, Filmes, Livros).
 * - Tradução PT/EN baseada no cookie "lang".
 * - Futuro: conteúdo dinâmico virá de banco/TEA API; aqui estático como mock.
 */

type Dict = {
  title: string;
  filters: { all: string; games: string; films: string; books: string };
  coming: string;
};

function getDict(): Dict {
  const lang = cookies().get("lang")?.value?.toLowerCase();
  if (lang === "en") {
    return {
      title: "News & Upcoming",
      filters: { all: "All", games: "Games", films: "Films", books: "Books" },
      coming: "Coming soon",
    };
  }
  return {
    title: "Novidades & Lançamentos",
    filters: { all: "Todos", games: "Jogos", films: "Filmes", books: "Livros" },
    coming: "Em breve",
  };
}

// Mock inicial de conteúdos (mais tarde virá do banco)
const mockContents = [
  {
    id: "christie",
    type: "game",
    title: "Christie",
    desc: "Pixel art investigativo inspirado em Agatha Christie.",
    date: "2026",
  },
  {
    id: "condado",
    type: "game",
    title: "Condado",
    desc: "Terror psicológico low poly, estilo Silent Hill.",
    date: "2026",
  },
  {
    id: "cosmic-coffee",
    type: "game",
    title: "Cosmic Coffee",
    desc: "Farming + exploração espacial, cozy mas ambicioso.",
    date: "2026",
  },
  {
    id: "larmadio",
    type: "film",
    title: "Larmadio",
    desc: "Drama de máfia sobre lealdade e traição.",
    date: "2026",
  },
  {
    id: "odio",
    type: "film",
    title: "Ódio",
    desc: "Western de vingança no sertão árido.",
    date: "2026",
  },
  {
    id: "livro-demo",
    type: "book",
    title: "Livro Exemplo",
    desc: "Obra literária CoffeeChroma — substituir pela lista real.",
    date: "2026",
  },
];

export default function NovidadesPage() {
  const t = getDict();
  return (
    <section>
      <h1 style={{ fontSize: 22, marginBottom: 18 }}>{t.title}</h1>

      {/* filtros (UI mock simples) */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <span className="chip active">{t.filters.all}</span>
        <span className="chip">{t.filters.games}</span>
        <span className="chip">{t.filters.films}</span>
        <span className="chip">{t.filters.books}</span>
      </div>

      {/* cards de lançamentos */}
      <div
        className="cards"
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
        }}
      >
        {mockContents.map((c) => (
          <article
            key={c.id}
            className="card"
            style={{
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 12,
              padding: 14,
              background: "#121216",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 16,
                marginBottom: 6,
              }}
            >
              {c.title}
            </div>
            <div className="muted" style={{ fontSize: 13, marginBottom: 8 }}>
              {c.desc}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              {t.coming}: {c.date}
            </div>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              <span
                className="tag"
                style={{
                  fontSize: 11,
                  padding: "3px 8px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,.06)",
                }}
              >
                {c.type.toUpperCase()}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
