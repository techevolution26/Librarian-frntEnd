import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Required in local development when Next/Image fetches from localhost/private IP.
    // . In production, preferingr HTTPS Railway/static storage URLs.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",

    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/static/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/static/**",
      },
      {
        protocol: "https",
        hostname: "librarian-backend-production.up.railway.app",
        pathname: "/static/**",
      },
    ],
  },
};

export default nextConfig;