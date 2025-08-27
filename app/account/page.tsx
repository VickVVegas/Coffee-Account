// app/account/page.tsx
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

/**
 * Página Account (painel do usuário logado)
 * - Mostra informações básicas da conta Coffee Account.
 * - Planos TEA, conquistas e dispositivos conectados.
 * - Tradução PT/EN baseada no cookie "lang".
 */

type Dict = {
  title: string;
  subtitle: string;
  sections: { plan: string; achievements: string; devices: string };
  noPlan: string;
};

function getDict(): Dict {
  const lang = cookies().get("lang")?.value?.toLowerCase();
  if (lang === "en") {
    return {
      title: "My Account",
      subtitle: "Manage your Coffee Account, subscriptions and devices.",
      sections: {
        plan: "TEA Plan",
        achievements: "Global Achievements",
        devices: "Connected Devices",
      },
      noPlan: "No plan active",
    };
  }
  return {
    title: "Minha Conta",
    subtitle: "Gerencie sua Coffee Account, assinaturas e dispositivos.",
    sections: {
      plan: "Plano TEA",
      achievements: "Conquistas globais",
      devices: "Dispositivos conectados",
    },
    noPlan: "Nenhum plano ativo",
  };
}

export default async function AccountPage() {
  const session = await getServerSession(authConfig);
  const t = getDict();

  return (
    <section>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>{t.title}</h1>
      <p className="muted" style={{ marginBottom: 18 }}>
        {t.subtitle}
      </p>

      <div
        className="cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: 14,
        }}
      >
        <div
          className="card"
          style={{ padding: 14, background: "#121216", borderRadius: 12 }}
        >
          <h2 style={{ fontSize: 16, marginBottom: 6 }}>{t.sections.plan}</h2>
          <p>
            {/* Mock: plano virá do banco/TEA API */}
            <strong>{t.noPlan}</strong>
          </p>
        </div>

        <div
          className="card"
          style={{ padding: 14, background: "#121216", borderRadius: 12 }}
        >
          <h2 style={{ fontSize: 16, marginBottom: 6 }}>
            {t.sections.achievements}
          </h2>
          <ul className="bullets">
            <li>🎖️ 10 reviews publicadas</li>
            <li>⭐ Respeito 128</li>
            <li>📚 3 coleções criadas</li>
          </ul>
        </div>

        <div
          className="card"
          style={{ padding: 14, background: "#121216", borderRadius: 12 }}
        >
          <h2 style={{ fontSize: 16, marginBottom: 6 }}>
            {t.sections.devices}
          </h2>
          <ul className="bullets">
            <li>📱 iPhone 14 (TEA Mobile)</li>
            <li>💻 Coffee Launcher (PC)</li>
            <li>☁️ Mantikora Cloud (Chrome)</li>
          </ul>
        </div>
      </div>

      {/* Sessão do usuário */}
      {session?.user && (
        <div style={{ marginTop: 28 }}>
          <p style={{ fontSize: 14 }}>
            {t.title}:{" "}
            <strong>{session.user.name ?? session.user.email}</strong>
          </p>
          <p className="muted" style={{ fontSize: 13 }}>
            ID: {session.user.id ?? "—"}
          </p>
        </div>
      )}
    </section>
  );
}
