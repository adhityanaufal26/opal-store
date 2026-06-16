import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        // HSTS — force HTTPS for 1 year
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
        // CSP — restrict resource loading
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://js.stripe.com https://app.sandbox.midtrans.com https://*.midtrans.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: https:",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https://api.midtrans.com https://app.sandbox.midtrans.com https://api.stripe.com wss: ws:",
            "frame-src 'self' https://challenges.cloudflare.com https://js.stripe.com https://hooks.stripe.com https://app.sandbox.midtrans.com https://*.midtrans.com",
          ].join("; "),
        },
        // Clickjacking protection
        { key: "X-Frame-Options", value: "DENY" },
        // Prevent MIME sniffing
        { key: "X-Content-Type-Options", value: "nosniff" },
        // Referrer policy
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        // Permissions policy — restrict browser features
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=(), payment=(self)",
        },
      ],
    },
    // Cache-Control for API routes — no cache by default
    {
      source: "/api/:path*",
      headers: [
        { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
        { key: "Pragma", value: "no-cache" },
      ],
    },
    // Cache-Control for static assets — long cache
    {
      source: "/_next/static/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
  ],
};

export default nextConfig;