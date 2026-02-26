import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['localhost', '127.0.0.1', '::1'],
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
        hostname: 'storeganise.s3.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
