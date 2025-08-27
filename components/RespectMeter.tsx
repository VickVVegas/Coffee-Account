// components/RespectMeter.tsx
"use client";

/**
 * RespectMeter
 * - Exibe uma barra de progresso representando o respeito do usuário
 * - Mostra nível atual e próximo marco
 */

export type RespectMeterProps = {
  respect: number;
};

function getLevel(respect: number) {
  if (respect >= 2000) return { label: "Ébano", color: "#4b0082", next: null };
  if (respect >= 1000)
    return { label: "Platina", color: "#9ad6f0", next: 2000 };
  if (respect >= 500) return { label: "Ouro", color: "#ffd700", next: 1000 };
  if (respect >= 200) return { label: "Prata", color: "#c0c0c0", next: 500 };
  return { label: "Bronze", color: "#cd7f32", next: 200 };
}

export default function RespectMeter({ respect }: RespectMeterProps) {
  const lvl = getLevel(respect);
  const nextGoal = lvl.next;
  const progress =
    nextGoal != null
      ? Math.min(100, Math.round((respect / nextGoal) * 100))
      : 100;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: "100%",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: lvl.color }}>
          {lvl.label}
        </span>
        <span style={{ fontSize: 12, opacity: 0.8 }}>
          {respect} {nextGoal ? `/ ${nextGoal}` : ""}
        </span>
      </div>

      {/* Barra */}
      <div
        style={{
          height: 8,
          borderRadius: 6,
          background: "rgba(255,255,255,.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: lvl.color,
            transition: "width 0.3s",
          }}
        />
      </div>
    </div>
  );
}
