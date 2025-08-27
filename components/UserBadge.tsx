// components/UserBadge.tsx
"use client";

/**
 * UserBadge
 * - Exibe avatar, nome e nível de respeito de um usuário
 * - Usado em reviews, guias, sidebar de perfil
 */

export type UserBadgeProps = {
  id: string;
  name: string;
  respect: number;
  image?: string | null;
};

function getRespectLevel(respect: number): { label: string; color: string } {
  if (respect >= 2000) return { label: "Ébano", color: "#4b0082" };
  if (respect >= 1000) return { label: "Platina", color: "#9ad6f0" };
  if (respect >= 500) return { label: "Ouro", color: "#ffd700" };
  if (respect >= 200) return { label: "Prata", color: "#c0c0c0" };
  return { label: "Bronze", color: "#cd7f32" };
}

export default function UserBadge({
  id,
  name,
  respect,
  image,
}: UserBadgeProps) {
  const lvl = getRespectLevel(respect);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: image
            ? `url(${image}) center/cover`
            : "linear-gradient(135deg,#684e2f,#e0b25b)",
        }}
      />

      {/* Info */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{name}</span>
        <span style={{ fontSize: 12, color: lvl.color }}>
          {lvl.label} • {respect}
        </span>
      </div>
    </div>
  );
}
