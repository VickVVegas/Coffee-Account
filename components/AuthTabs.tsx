// components/AuthTabs.tsx
"use client";

import { useState } from "react";

/**
 * AuthTabs
 * - Componente UI para login/registro rápido
 * - Troca entre abas "Entrar" e "Registrar"
 * - Mock de UI (não conectado à API ainda)
 */

export default function AuthTabs() {
  const [tab, setTab] = useState<"login" | "register">("login");

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
          Entrar
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
          Registrar
        </button>
      </div>

      {/* Form Login */}
      {tab === "login" && (
        <form
          style={{ display: "grid", gap: 12 }}
          onSubmit={(e) => {
            e.preventDefault();
            alert("Login submit (mock)");
          }}
        >
          <input
            type="email"
            placeholder="E-mail"
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Senha"
            required
            style={inputStyle}
          />
          <button type="submit" className="cta">
            Entrar
          </button>
        </form>
      )}

      {/* Form Registro */}
      {tab === "register" && (
        <form
          style={{ display: "grid", gap: 12 }}
          onSubmit={(e) => {
            e.preventDefault();
            alert("Register submit (mock)");
          }}
        >
          <input type="text" placeholder="Nome" style={inputStyle} />
          <input
            type="email"
            placeholder="E-mail"
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Senha (mín. 6)"
            required
            style={inputStyle}
          />
          <button type="submit" className="cta">
            Criar Conta
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
