/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // This effectively disables the security block for localhost dev
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080", // Matches your new port
        pathname: "/static/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000", // Matches your old database records
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
