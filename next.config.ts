import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.builder.io',
      },
      {
        protocol: 'https',
        hostname: 'blog.stufstorage.com',
      },
      {
        protocol: 'https',
        hostname: 'lp.stufstorage.com',
      },
    ],
  },
  // experimental: {},
};

export default nextConfig;
