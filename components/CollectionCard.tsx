// components/CollectionCard.tsx
"use client";

import Link from "next/link";

/**
 * CollectionCard
 * - Exibe uma coleção criada pelo usuário (jogos, livros, filmes, etc.)
 * - Mostra título, autor e quantidade de itens
 * - Pode ter capa mock (primeiro item ou cor aleatória)
 */

export type CollectionCardProps = {
  id: string;
  title: string;
  author: { id: string; name: string };
  itemsCount: number;
  coverUrl?: string | null;
};

export default function CollectionCard({
  id,
  title,
  author,
  itemsCount,
  coverUrl,
}: CollectionCardProps) {
  return (
    <article
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 14,
        background: "#121216",
        borderRadius: 12,
      }}
    >
      {/* Capa */}
      <div
        style={{
          height: 120,
          borderRadius: 8,
          background: coverUrl
            ? `url(${coverUrl}) center/cover`
            : "linear-gradient(135deg,#684e2f,#e0b25b)",
        }}
      />

      {/* Título */}
      <h3 style={{ fontSize: 16, marginTop: 6 }}>
        <Link href={`/colecoes/${id}`}>{title}</Link>
      </h3>

      {/* Autor */}
      <p className="muted" style={{ fontSize: 13 }}>
        {author.name}
      </p>

      {/* Itens */}
      <span style={{ fontSize: 13, opacity: 0.85 }}>
        {itemsCount} {itemsCount === 1 ? "item" : "itens"}
      </span>
    </article>
  );
}
