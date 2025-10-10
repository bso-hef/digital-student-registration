import type { NextConfig } from "next";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig: NextConfig = {
  // The rewrites configuration allows you to proxy requests to another server.
  // In this case, we are proxying all requests made to '/api/:path*' to the backend server
  // running on 'https://localhost:3000/api/:path*'.
  // This is useful in development to avoid CORS issues.
  async rewrites() {
    return [];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "3000",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
