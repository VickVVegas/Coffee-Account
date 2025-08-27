// components/NotificationBell.tsx
"use client";

import { useState, useEffect } from "react";

/**
 * NotificationBell
 * - Ícone de sino que mostra número de notificações não lidas
 * - Mock inicial: carrega contagem fake, mas já preparado para fetch real
 */

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  // Mock inicial: simula fetch
  useEffect(() => {
    async function load() {
      try {
        // No futuro: const res = await fetch("/api/notifications");
        // const data = await res.json();
        // setCount(data.filter((n: any) => !n.read).length);
        setCount(3); // mock
      } catch (err) {
        console.error("NotificationBell error:", err);
      }
    }
    load();
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* Botão do sino */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: 20,
          color: "#eaeaf2",
          position: "relative",
        }}
      >
        🔔
        {count > 0 && (
          <span
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              background: "#e0b25b",
              color: "#0d0d0f",
              fontSize: 12,
              fontWeight: 700,
              borderRadius: "50%",
              width: 18,
              height: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "120%",
            right: 0,
            background: "#121216",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 8,
            padding: 10,
            width: 220,
            zIndex: 100,
          }}
        >
          <p style={{ fontSize: 14, marginBottom: 8 }}>
            🔔 Notificações (mock)
          </p>
          <ul style={{ listStyle: "none", fontSize: 13, lineHeight: "1.4" }}>
            <li>⭐ Sua review recebeu 4 likes</li>
            <li>💡 Guia marcado como útil</li>
            <li>👤 Novo seguidor</li>
          </ul>
        </div>
      )}
    </div>
  );
}
