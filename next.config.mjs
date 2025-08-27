/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  experimental: {
    // Permite Server Actions com limite de payload (ajuste se for enviar arquivos maiores)
    serverActions: { bodySizeLimit: "2mb" },
  },

  // Ajuste domínios permitidos para imagens remotas conforme sua infra/CDN
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.coffeechroma.com" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  // Cabeçalhos de segurança básicos
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
