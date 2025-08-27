// app/assinaturas/page.tsx
import { cookies } from "next/headers";

/**
 * Página Assinaturas
 * - Lista os planos TEA (Individual, Duo+, Família+, Mantikora).
 * - Tradução PT/EN baseada no cookie "lang".
 */

type Dict = {
  title: string;
  subtitle: string;
  plans: {
    id: string;
    name: string;
    price: string;
    desc: string;
    perks: string[];
    cta: string;
  }[];
};

function getDict(): Dict {
  const lang = cookies().get("lang")?.value?.toLowerCase();
  if (lang === "en") {
    return {
      title: "TEA Subscriptions",
      subtitle: "Choose your plan and unlock the full CoffeeChroma universe.",
      plans: [
        {
          id: "individual",
          name: "Individual",
          price: "$7.90 / mo",
          desc: "Perfect for a single user.",
          perks: [
            "Full TEA library (games, music, films, books)",
            "No ads on mobile",
            "Unified achievements",
          ],
          cta: "Subscribe",
        },
        {
          id: "duo",
          name: "Duo+",
          price: "$11.90 / mo",
          desc: "Two profiles, one subscription.",
          perks: [
            "Everything in Individual",
            "2 active profiles",
            "Shared collections",
          ],
          cta: "Subscribe",
        },
        {
          id: "family",
          name: "Family+",
          price: "$19.99 / mo",
          desc: "Up to 5 profiles.",
          perks: [
            "Everything in Duo+",
            "5 active profiles",
            "Parental controls",
          ],
          cta: "Subscribe",
        },
        {
          id: "mantikora",
          name: "Mantikora TEA",
          price: "$39.90 / mo",
          desc: "All TEA benefits + Cloud Gaming with Mantikora.",
          perks: [
            "Everything in Family+",
            "Play CoffeeChroma PC/console titles in the cloud",
            "Access on mobile, TV and browser",
          ],
          cta: "Subscribe",
        },
      ],
    };
  }
  return {
    title: "Assinaturas TEA",
    subtitle: "Escolha seu plano e desbloqueie todo o universo CoffeeChroma.",
    plans: [
      {
        id: "individual",
        name: "Individual",
        price: "R$7,90 / mês",
        desc: "Perfeito para um usuário.",
        perks: [
          "Biblioteca completa TEA (jogos, músicas, filmes, livros)",
          "Sem anúncios no mobile",
          "Conquistas unificadas",
        ],
        cta: "Assinar",
      },
      {
        id: "duo",
        name: "Duo+",
        price: "R$11,90 / mês",
        desc: "Dois perfis, uma assinatura.",
        perks: [
          "Tudo do Individual",
          "2 perfis ativos",
          "Coleções compartilhadas",
        ],
        cta: "Assinar",
      },
      {
        id: "family",
        name: "Família+",
        price: "R$19,99 / mês",
        desc: "Até 5 perfis.",
        perks: ["Tudo do Duo+", "5 perfis ativos", "Controles parentais"],
        cta: "Assinar",
      },
      {
        id: "mantikora",
        name: "Mantikora TEA",
        price: "R$39,90 / mês",
        desc: "Todos os benefícios TEA + Cloud Gaming Mantikora.",
        perks: [
          "Tudo da Família+",
          "Jogue títulos PC/console CoffeeChroma na nuvem",
          "Acesso em mobile, TV e navegador",
        ],
        cta: "Assinar",
      },
    ],
  };
}

export default function AssinaturasPage() {
  const t = getDict();

  return (
    <section>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>{t.title}</h1>
      <p className="muted" style={{ marginBottom: 18 }}>
        {t.subtitle}
      </p>

      <div
        style={{
          display: "grid",
          gap: 18,
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
        }}
      >
        {t.plans.map((p) => (
          <article
            key={p.id}
            className="card"
            style={{
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 12,
              padding: 16,
              background: "#121216",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h2 style={{ fontSize: 18, marginBottom: 4 }}>{p.name}</h2>
              <p className="muted" style={{ marginBottom: 6 }}>
                {p.desc}
              </p>
              <p style={{ fontWeight: 700, marginBottom: 10 }}>{p.price}</p>
              <ul className="bullets">
                {p.perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </div>
            <button className="cta" style={{ marginTop: 14 }}>
              {p.cta}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
