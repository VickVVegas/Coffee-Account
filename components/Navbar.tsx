// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Navbar global da Coffee Account
 * - Links principais: Novidades, Feed, Reviews, Perfil, Assinaturas, Amigos, Biblioteca
 * - Destaque para rota ativa
 * - Switch de idioma (PT/EN) salva em cookie
 */

const navItems = [
  { href: "/novidades", label: { pt: "Novidades", en: "News" } },
  { href: "/feed", label: { pt: "Feed", en: "Feed" } },
  { href: "/reviews", label: { pt: "Reviews", en: "Reviews" } },
  { href: "/perfil/me", label: { pt: "Perfil", en: "Profile" } },
  { href: "/assinaturas", label: { pt: "Assinaturas", en: "Subscriptions" } },
  { href: "/amigos", label: { pt: "Amigos", en: "Friends" } },
  { href: "/biblioteca", label: { pt: "Biblioteca", en: "Library" } },
];

export default function Navbar() {
  const pathname = usePathname();
  const [lang, setLang] = useState<"pt" | "en">("pt");

  useEffect(() => {
    const stored = document.cookie
      .split("; ")
      .find((c) => c.startsWith("lang="))
      ?.split("=")[1] as "pt" | "en" | undefined;
    if (stored) setLang(stored);
  }, []);

  function toggleLang() {
    const newLang = lang === "pt" ? "en" : "pt";
    setLang(newLang);
    document.cookie = `lang=${newLang}; path=/; max-age=31536000`;
    location.reload();
  }

  return (
    <header className="hdr">
      <div
        className="wrap"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Brand */}
        <Link href="/" className="brand">
          <div className="logo" />
          <span className="tea">Coffee Account</span>
        </Link>

        {/* Navegação */}
        <nav style={{ display: "flex", gap: 18, alignItems: "center" }}>
          {navItems.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="navlink"
                style={{
                  fontWeight: active ? 700 : 400,
                  color: active ? "#e0b25b" : undefined,
                }}
              >
                {item.label[lang]}
              </Link>
            );
          })}

          {/* Idioma */}
          <button onClick={toggleLang} className="lang-pill">
            {lang === "pt" ? "PT" : "EN"}
          </button>
        </nav>
      </div>
    </header>
  );
}
