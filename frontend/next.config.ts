import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: "https://betsync-backend.onrender.com/auth/:path*",
      },
    ];
  },
};

export default nextConfig;
