// components/GuideCard.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * GuideCard
 * - Exibe guia da comunidade de forma compacta
 * - Mostra título, autor, conteúdo relacionado, preview do texto
 * - Permite reações rápidas (like, útil, favorito) — mock inicial
 */

export type GuideCardProps = {
  id: string;
  title: string;
  author: { id: string; name: string };
  content: { id: string; title: string; type: string };
  body: string;
  createdAt?: string;
};

export default function GuideCard({
  id,
  title,
  author,
  content,
  body,
  createdAt,
}: GuideCardProps) {
  const [likes, setLikes] = useState(0);
  const [useful, setUseful] = useState(0);
  const [fav, setFav] = useState(0);

  return (
    <article
      className="card"
      style={{
        padding: 16,
        background: "#121216",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {/* Header */}
      <header>
        <h3 style={{ fontSize: 16, marginBottom: 2 }}>
          <Link href={`/guias/${id}`}>{title}</Link>
        </h3>
        <p className="muted" style={{ fontSize: 13 }}>
          {author.name} — {content.title}
        </p>
      </header>

      {/* Corpo (preview) */}
      <p style={{ fontSize: 14, color: "#d0d2d6" }}>
        {body.length > 180 ? body.slice(0, 180) + "…" : body}
      </p>

      {/* Data */}
      {createdAt && (
        <span style={{ fontSize: 12, opacity: 0.6 }}>
          {new Date(createdAt).toLocaleDateString()}
        </span>
      )}

      {/* Reações */}
      <footer
        style={{
          display: "flex",
          gap: 12,
          marginTop: 8,
          fontSize: 13,
          opacity: 0.9,
        }}
      >
        <button onClick={() => setLikes((v) => v + 1)} style={reactionBtn}>
          👍 {likes}
        </button>
        <button onClick={() => setUseful((v) => v + 1)} style={reactionBtn}>
          💡 {useful}
        </button>
        <button onClick={() => setFav((v) => v + 1)} style={reactionBtn}>
          ⭐ {fav}
        </button>
      </footer>
    </article>
  );
}

const reactionBtn: React.CSSProperties = {
  background: "rgba(255,255,255,.06)",
  border: "1px solid rgba(255,255,255,.1)",
  borderRadius: 8,
  padding: "4px 8px",
  fontSize: 13,
  cursor: "pointer",
};
