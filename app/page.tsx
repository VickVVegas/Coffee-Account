"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

/**
 * Página inicial (Landing)
 * - Mostra boas-vindas e painel de login/registro
 * - Tradução PT/EN baseada em cookie de idioma
 */

type Dict = {
  welcome: string;
  description: string;
  login: string;
  register: string;
};

function getDict(lang: "pt" | "en"): Dict {
  if (lang === "en") {
    return {
      welcome: "Welcome to Coffee Account",
      description:
        "Your hub for games, films, books, albums, RPGs and more. Organize, review, share and earn respect!",
      login: "Sign In",
      register: "Create Account",
    };
  }
  return {
    welcome: "Bem-vindo à Coffee Account",
    description:
      "Seu hub para jogos, filmes, livros, álbuns, RPGs e muito mais. Organize, avalie, compartilhe e conquiste respeito!",
    login: "Entrar",
    register: "Criar Conta",
  };
}

// =====================
// Painel de Autenticação
// =====================

function AuthPanel({ t }: { t: Dict }) {
  const [tab, setTab] = useState<"login" | "register">("login");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/feed",
    });
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/feed",
    });
  }

  return (
    <div
      className="card"
      style={{
        maxWidth: 380,
        margin: "40px auto",
        padding: 20,
        background: "#121216",
        borderRadius: 12,
      }}
    >
      {/* Abas */}
      <div
        style={{
          display: "flex",
          marginBottom: 16,
          borderBottom: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <button
          onClick={() => setTab("login")}
          className="navlink"
          style={{
            flex: 1,
            padding: "8px 0",
            fontWeight: tab === "login" ? 700 : 400,
            borderBottom:
              tab === "login" ? "2px solid #e0b25b" : "2px solid transparent",
          }}
        >
          {t.login}
        </button>
        <button
          onClick={() => setTab("register")}
          className="navlink"
          style={{
            flex: 1,
            padding: "8px 0",
            fontWeight: tab === "register" ? 700 : 400,
            borderBottom:
              tab === "register"
                ? "2px solid #e0b25b"
                : "2px solid transparent",
          }}
        >
          {t.register}
        </button>
      </div>

      {/* Formulário Login */}
      {tab === "login" && (
        <form style={{ display: "grid", gap: 12 }} onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            required
            style={inputStyle}
          />
          <button type="submit" className="cta">
            {t.login}
          </button>
        </form>
      )}

      {/* Formulário Registro */}
      {tab === "register" && (
        <form style={{ display: "grid", gap: 12 }} onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Nome"
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            placeholder="Senha (mín. 6)"
            required
            style={inputStyle}
          />
          <button type="submit" className="cta">
            {t.register}
          </button>
        </form>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,.12)",
  background: "#1a1a1e",
  color: "#eaeaf2",
  fontSize: 14,
};

// =====================
// Página Principal
// =====================

export default function HomePage() {
  const cookieLang =
    typeof document !== "undefined"
      ? document.cookie
          .split("; ")
          .find((c) => c.startsWith("lang="))
          ?.split("=")[1]
      : "pt";

  const lang = cookieLang === "en" ? "en" : "pt";
  const t = getDict(lang);

  return (
    <main className="wrap" style={{ paddingTop: 40 }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>{t.welcome}</h1>
      <p style={{ fontSize: 15, maxWidth: 600, marginBottom: 30 }}>
        {t.description}
      </p>

      <AuthPanel t={t} />
    </main>
  );
}
