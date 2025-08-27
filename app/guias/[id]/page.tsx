// app/guias/[id]/page.tsx
import { cookies } from "next/headers";

/**
 * Página de Guia
 * - Exibe um guia criado pela comunidade para um conteúdo (jogo, filme, livro, RPG).
 * - Inclui título, autor, texto e reações.
 * - Tradução PT/EN baseada no cookie "lang".
 */

type Dict = {
  back: string;
  reactions: string;
  author: string;
  content: string;
};

function getDict(): Dict {
  const lang = cookies().get("lang")?.value?.toLowerCase();
  if (lang === "en") {
    return {
      back: "← Back to Guides",
      reactions: "Reactions",
      author: "Author",
      content: "Content",
    };
  }
  return {
    back: "← Voltar para Guias",
    reactions: "Reações",
    author: "Autor",
    content: "Conteúdo",
  };
}

// Mock de guias
const mockGuides: Record<
  string,
  { id: string; title: string; author: string; body: string; content: string }
> = {
  "cosmic-coffee-intro": {
    id: "cosmic-coffee-intro",
    title: "Guia do Iniciante em Cosmic Coffee",
    author: "Lia",
    body: `Este guia cobre as primeiras horas em Cosmic Coffee.
- Plante grãos de café cedo para garantir moeda estável.
- Explore vizinhanças para encontrar sementes raras.
- Não esqueça de socializar: NPCs oferecem bônus.`,
    content: "Cosmic Coffee (Game)",
  },
  "christie-tips": {
    id: "christie-tips",
    title: "Dicas para resolver os casos em Christie",
    author: "Ana",
    body: `- Sempre investigue cada pista duas vezes.
- Converse com todos os NPCs para liberar diálogos secretos.
- Tome notas: alguns puzzles exigem lembrar padrões.`,
    content: "Christie (Game)",
  },
};

export default function GuiaPage({ params }: { params: { id: string } }) {
  const t = getDict();
  const guia = mockGuides[params.id];

  if (!guia) {
    return (
      <section>
        <h1>404</h1>
        <p>Guia não encontrado.</p>
      </section>
    );
  }

  return (
    <section>
      <a
        href="/reviews"
        className="navlink"
        style={{ display: "inline-block", marginBottom: 14 }}
      >
        {t.back}
      </a>

      <header style={{ marginBottom: 12 }}>
        <h1 style={{ fontSize: 22 }}>{guia.title}</h1>
        <p className="muted">
          {t.author}: {guia.author} • {t.content}: {guia.content}
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
          whiteSpace: "pre-line",
        }}
      >
        {guia.body}
      </article>

      <footer
        style={{
          fontSize: 13,
          display: "flex",
          gap: 12,
          opacity: 0.8,
        }}
      >
        <span>{t.reactions}:</span>
        <span role="button">👍 12</span>
        <span role="button">⭐ 5</span>
        <span role="button">💡 3</span>
      </footer>
    </section>
  );
}
