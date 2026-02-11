import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080', // Your Go backend URL
      },
    ];
  },
};

export default nextConfig;
