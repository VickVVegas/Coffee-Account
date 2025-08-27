// app/biblioteca/page.tsx
import { cookies } from "next/headers";

/**
 * Página Biblioteca
 * - Reúne tudo que o usuário possui/segue (jogos, filmes, livros, músicas, HQs, RPGs).
 * - Filtros por tipo e status.
 * - Tradução PT/EN baseada no cookie "lang".
 */

type Dict = {
  title: string;
  filters: {
    all: string;
    games: string;
    films: string;
    books: string;
    music: string;
    hqs: string;
    rpgs: string;
  };
  status: {
    playing: string;
    finished: string;
    wishlist: string;
    dropped: string;
  };
};

function getDict(): Dict {
  const lang = cookies().get("lang")?.value?.toLowerCase();
  if (lang === "en") {
    return {
      title: "My Library",
      filters: {
        all: "All",
        games: "Games",
        films: "Films",
        books: "Books",
        music: "Music",
        hqs: "Comics",
        rpgs: "RPGs",
      },
      status: {
        playing: "Playing/Reading",
        finished: "Finished",
        wishlist: "Wishlist",
        dropped: "Dropped",
      },
    };
  }
  return {
    title: "Minha Biblioteca",
    filters: {
      all: "Todos",
      games: "Jogos",
      films: "Filmes",
      books: "Livros",
      music: "Músicas",
      hqs: "HQs",
      rpgs: "RPGs",
    },
    status: {
      playing: "Jogando/Lendo",
      finished: "Finalizado",
      wishlist: "Lista de desejos",
      dropped: "Abandonado",
    },
  };
}

// Mock de itens da biblioteca
const mockLibrary = [
  {
    id: "1",
    type: "game",
    title: "Christie",
    status: "playing",
  },
  {
    id: "2",
    type: "film",
    title: "Larmadio",
    status: "wishlist",
  },
  {
    id: "3",
    type: "book",
    title: "Livro Exemplo",
    status: "finished",
  },
  {
    id: "4",
    type: "game",
    title: "Cosmic Coffee",
    status: "wishlist",
  },
  {
    id: "5",
    type: "rpg",
    title: "Katarses — Shadow Umbra",
    status: "dropped",
  },
];

export default function BibliotecaPage() {
  const t = getDict();

  return (
    <section>
      <h1 style={{ fontSize: 22, marginBottom: 18 }}>{t.title}</h1>

      {/* filtros por mídia */}
      <div
        style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}
      >
        <span className="chip active">{t.filters.all}</span>
        <span className="chip">{t.filters.games}</span>
        <span className="chip">{t.filters.films}</span>
        <span className="chip">{t.filters.books}</span>
        <span className="chip">{t.filters.music}</span>
        <span className="chip">{t.filters.hqs}</span>
        <span className="chip">{t.filters.rpgs}</span>
      </div>

      {/* grid de itens */}
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        }}
      >
        {mockLibrary.map((item) => (
          <article
            key={item.id}
            className="card"
            style={{
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 12,
              padding: 14,
              background: "#121216",
            }}
          >
            <header style={{ fontWeight: 600, marginBottom: 6 }}>
              {item.title}
            </header>
            <div className="muted" style={{ fontSize: 13, marginBottom: 8 }}>
              {item.type.toUpperCase()}
            </div>
            <div
              style={{
                fontSize: 13,
                padding: "4px 8px",
                borderRadius: 8,
                background: "rgba(255,255,255,.06)",
                display: "inline-block",
              }}
            >
              {renderStatus(item.status, t)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function renderStatus(status: string, t: Dict) {
  switch (status) {
    case "playing":
      return t.status.playing;
    case "finished":
      return t.status.finished;
    case "wishlist":
      return t.status.wishlist;
    case "dropped":
      return t.status.dropped;
    default:
      return "";
  }
}
