// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Sidebar lateral opcional
 * - Complementa a Navbar com atalhos rápidos
 * - Pode ser expandida futuramente (ex.: notificações, conquistas)
 */

const sideItems = [
  { href: "/account", label: { pt: "Conta", en: "Account" }, icon: "👤" },
  {
    href: "/notifications",
    label: { pt: "Notificações", en: "Notifications" },
    icon: "🔔",
  },
  {
    href: "/assinaturas",
    label: { pt: "Assinaturas", en: "Subscriptions" },
    icon: "💳",
  },
  {
    href: "/biblioteca",
    label: { pt: "Biblioteca", en: "Library" },
    icon: "📚",
  },
  { href: "/amigos", label: { pt: "Amigos", en: "Friends" }, icon: "🤝" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [lang, setLang] = useState<"pt" | "en">("pt");

  useEffect(() => {
    const stored = document.cookie
      .split("; ")
      .find((c) => c.startsWith("lang="))
      ?.split("=")[1] as "pt" | "en" | undefined;
    if (stored) setLang(stored);
  }, []);

  return (
    <aside
      style={{
        position: "fixed",
        top: 60,
        left: 0,
        bottom: 0,
        width: 220,
        background: "#0f0f12",
        borderRight: "1px solid rgba(255,255,255,.08)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {sideItems.map((item) => {
        const active = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="navlink"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontWeight: active ? 700 : 400,
              color: active ? "#e0b25b" : "#eaeaf2",
              background: active ? "rgba(224,178,91,0.08)" : "transparent",
              padding: "8px 10px",
              borderRadius: 8,
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label[lang]}
          </Link>
        );
      })}
    </aside>
  );
}
