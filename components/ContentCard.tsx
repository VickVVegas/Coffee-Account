// components/ContentCard.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * ContentCard
 * - Exibe um card compacto de conteúdo (jogo, filme, livro, etc.)
 * - Mostra capa, título, tipo, data/label de lançamento
 * - Botões rápidos para seguir ou adicionar à biblioteca
 */

export type ContentCardProps = {
  id: string;
  slug: string;
  title: string;
  typeLabel: string;
  type: string;
  description?: string;
  releaseLabel: string;
  releaseKey: "available" | "soon" | "preview";
  coverUrl?: string | null;
};

export default function ContentCard({
  id,
  slug,
  title,
  typeLabel,
  type,
  description,
  releaseLabel,
  releaseKey,
  coverUrl,
}: ContentCardProps) {
  const [following, setFollowing] = useState(false);
  const [inLibrary, setInLibrary] = useState(false);

  return (
    <article
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 260,
      }}
    >
      <Link href={`/conteudo/${slug}`} style={{ flexGrow: 1 }}>
        {/* Capa */}
        <div
          style={{
            height: 120,
            borderRadius: 8,
            background: coverUrl
              ? `url(${coverUrl}) center/cover`
              : "linear-gradient(135deg,#684e2f,#e0b25b)",
            marginBottom: 10,
          }}
        />

        {/* Título e tipo */}
        <h3 style={{ fontSize: 16, marginBottom: 4 }}>{title}</h3>
        <p className="muted" style={{ fontSize: 13, marginBottom: 6 }}>
          {typeLabel}
        </p>

        {/* Status de lançamento */}
        <span
          style={{
            fontSize: 12,
            padding: "4px 8px",
            borderRadius: 6,
            background:
              releaseKey === "available"
                ? "rgba(80,200,120,.15)"
                : releaseKey === "soon"
                ? "rgba(255,200,80,.15)"
                : "rgba(180,180,255,.12)",
            color:
              releaseKey === "available"
                ? "#50c878"
                : releaseKey === "soon"
                ? "#e0b25b"
                : "#aaaaff",
          }}
        >
          {releaseLabel}
        </span>
      </Link>

      {/* Ações */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={() => setFollowing((v) => !v)}
          className="cta"
          style={{
            flex: 1,
            background: following ? "#444" : "#e0b25b",
            color: following ? "#ddd" : "#0d0d0f",
          }}
        >
          {following ? "Seguindo" : "Seguir"}
        </button>
        <button
          onClick={() => setInLibrary((v) => !v)}
          className="cta"
          style={{
            flex: 1,
            background: inLibrary ? "#444" : "#e0b25b",
            color: inLibrary ? "#ddd" : "#0d0d0f",
          }}
        >
          {inLibrary ? "Na Biblioteca" : "Adicionar"}
        </button>
      </div>
    </article>
  );
}
