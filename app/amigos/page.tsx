// app/amigos/page.tsx
import { cookies } from "next/headers";

/**
 * Página Amigos
 * - Lista de amigos, convites e sugestões.
 * - Tradução PT/EN baseada no cookie "lang".
 */

type Dict = {
  title: string;
  tabs: { all: string; requests: string; suggestions: string };
  labels: { accept: string; decline: string; add: string };
};

function getDict(): Dict {
  const lang = cookies().get("lang")?.value?.toLowerCase();
  if (lang === "en") {
    return {
      title: "Friends",
      tabs: {
        all: "All friends",
        requests: "Requests",
        suggestions: "Suggestions",
      },
      labels: { accept: "Accept", decline: "Decline", add: "Add friend" },
    };
  }
  return {
    title: "Amigos",
    tabs: {
      all: "Todos os amigos",
      requests: "Convites",
      suggestions: "Sugestões",
    },
    labels: { accept: "Aceitar", decline: "Recusar", add: "Adicionar amigo" },
  };
}

// Mock de amigos, convites e sugestões
const mockFriends = [
  { id: 1, name: "Ana", respect: 140 },
  { id: 2, name: "Victor", respect: 90 },
];
const mockRequests = [{ id: 3, name: "Lia", respect: 45 }];
const mockSuggestions = [
  { id: 4, name: "Rafael", respect: 200 },
  { id: 5, name: "Marina", respect: 75 },
];

export default function AmigosPage() {
  const t = getDict();

  return (
    <section>
      <h1 style={{ fontSize: 22, marginBottom: 18 }}>{t.title}</h1>

      {/* abas (UI mock simples) */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <span className="chip active">{t.tabs.all}</span>
        <span className="chip">{t.tabs.requests}</span>
        <span className="chip">{t.tabs.suggestions}</span>
      </div>

      {/* amigos */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 10 }}>{t.tabs.all}</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {mockFriends.map((f) => (
            <div
              key={f.id}
              className="card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 12,
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 10,
                background: "#121216",
              }}
            >
              <span>
                {f.name} — ⭐ {f.respect}
              </span>
              <button
                className="cta"
                style={{ fontSize: 12, padding: "6px 10px" }}
              >
                Chat
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* convites */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 10 }}>{t.tabs.requests}</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {mockRequests.map((r) => (
            <div
              key={r.id}
              className="card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 12,
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 10,
                background: "#121216",
              }}
            >
              <span>
                {r.name} — ⭐ {r.respect}
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="cta"
                  style={{ fontSize: 12, padding: "6px 10px" }}
                >
                  {t.labels.accept}
                </button>
                <button
                  style={{
                    fontSize: 12,
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,.08)",
                    background: "#1a1a1e",
                    color: "#aaa",
                  }}
                >
                  {t.labels.decline}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* sugestões */}
      <div>
        <h2 style={{ fontSize: 18, marginBottom: 10 }}>{t.tabs.suggestions}</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {mockSuggestions.map((s) => (
            <div
              key={s.id}
              className="card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 12,
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 10,
                background: "#121216",
              }}
            >
              <span>
                {s.name} — ⭐ {s.respect}
              </span>
              <button
                className="cta"
                style={{ fontSize: 12, padding: "6px 10px" }}
              >
                {t.labels.add}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
