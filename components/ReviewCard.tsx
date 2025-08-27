// components/ReviewCard.tsx
"use client";

import { useState } from "react";

/**
 * ReviewCard
 * - Exibe uma review da comunidade com usuário, conteúdo, nota e texto
 * - Permite reações simples (like, útil, favorito) em mock inicial
 */

export type ReviewCardProps = {
  id: string;
  user: { id: string; name: string };
  content: { id: string; title: string; type: string };
  rating: number;
  text: string;
  spoiler?: boolean;
  createdAt?: string;
};

export default function ReviewCard({
  id,
  user,
  content,
  rating,
  text,
  spoiler,
  createdAt,
}: ReviewCardProps) {
  const [likes, setLikes] = useState(0);
  const [useful, setUseful] = useState(0);
  const [fav, setFav] = useState(0);

  return (
    <article
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: 16,
        background: "#121216",
      }}
    >
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 14 }}>
          <strong>{user.name}</strong> → {content.title}
        </div>
        <span style={{ fontSize: 13, opacity: 0.8 }}>⭐ {rating}/10</span>
      </header>

      {/* Texto */}
      <p style={{ fontSize: 14, color: "#d0d2d6" }}>
        {spoiler ? <i>(contém spoiler)</i> : text}
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
