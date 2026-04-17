import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a minimal standalone server in .next/standalone for Docker
  output: "standalone",

  // Reduce client bundle by removing console.* in production (except warn/error)
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

  // Security & performance headers
  async headers() {
    const securityHeaders = [
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ];
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  // If you later add remote images, whitelist domains here
  images: {
    remotePatterns: [
      // { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  // Fail fast on bad env on build
  experimental: {
    // keep empty unless you specifically need experimental flags
  },
};

export default nextConfig;
