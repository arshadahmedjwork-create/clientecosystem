import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/mylon',
        destination: '/mylon.html',
      },
    ]
  },
};

export default nextConfig;
