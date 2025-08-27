// app/feed/page.tsx
import { cookies } from "next/headers";

/**
 * Página Feed
 * - Timeline personalizada de amigos, reviews, conquistas e guias.
 * - Aqui: mock simples para estruturar a UI.
 * - Tradução PT/EN baseada no cookie "lang".
 */

type Dict = {
  title: string;
  filters: {
    all: string;
    friends: string;
    reviews: string;
    guides: string;
    achievements: string;
  };
  sample: { post: string; review: string; guide: string; achievement: string };
};

function getDict(): Dict {
  const lang = cookies().get("lang")?.value?.toLowerCase();
  if (lang === "en") {
    return {
      title: "Community Feed",
      filters: {
        all: "All",
        friends: "Friends",
        reviews: "Reviews",
        guides: "Guides",
        achievements: "Achievements",
      },
      sample: {
        post: "shared a new update",
        review: "reviewed the game Christie",
        guide: "published a new guide for Cosmic Coffee",
        achievement: "unlocked an achievement in Condado",
      },
    };
  }
  return {
    title: "Feed da Comunidade",
    filters: {
      all: "Todos",
      friends: "Amigos",
      reviews: "Reviews",
      guides: "Guias",
      achievements: "Conquistas",
    },
    sample: {
      post: "compartilhou uma nova atualização",
      review: "avaliou o jogo Christie",
      guide: "publicou um guia novo de Cosmic Coffee",
      achievement: "desbloqueou uma conquista em Condado",
    },
  };
}

// Mock de posts para demonstração
const mockFeed = [
  {
    id: 1,
    user: "Ana",
    type: "post",
    content: "Dilog terá atualização com novos casos!",
  },
  {
    id: 2,
    user: "Victor",
    type: "review",
    content: "Christie é uma obra-prima investigativa.",
  },
  {
    id: 3,
    user: "Lia",
    type: "guide",
    content: "Guia: como começar sua fazenda em Cosmic Coffee.",
  },
  {
    id: 4,
    user: "Rafael",
    type: "achievement",
    content: "Conquista 'Sobrevivente da Noite' desbloqueada!",
  },
];

export default function FeedPage() {
  const t = getDict();

  return (
    <section>
      <h1 style={{ fontSize: 22, marginBottom: 18 }}>{t.title}</h1>

      {/* filtros */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <span className="chip active">{t.filters.all}</span>
        <span className="chip">{t.filters.friends}</span>
        <span className="chip">{t.filters.reviews}</span>
        <span className="chip">{t.filters.guides}</span>
        <span className="chip">{t.filters.achievements}</span>
      </div>

      {/* lista de posts */}
      <div className="feed" style={{ display: "grid", gap: 14 }}>
        {mockFeed.map((item) => (
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
              {item.user} {renderSampleText(item.type, t)}
            </header>
            <p style={{ fontSize: 14, color: "#d0d2d6" }}>{item.content}</p>
            <footer
              style={{
                marginTop: 10,
                display: "flex",
                gap: 12,
                fontSize: 12,
                opacity: 0.7,
              }}
            >
              <span role="button">👍 12</span>
              <span role="button">💬 3</span>
              <span role="button">⭐ 1</span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function renderSampleText(type: string, t: Dict) {
  switch (type) {
    case "post":
      return t.sample.post;
    case "review":
      return t.sample.review;
    case "guide":
      return t.sample.guide;
    case "achievement":
      return t.sample.achievement;
    default:
      return "";
  }
}
