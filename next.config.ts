import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
<<<<<<< HEAD
=======
  serverExternalPackages: ['pg', 'typeorm', 'reflect-metadata'],
>>>>>>> feat/custom-integration

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
        hostname: 'storage.googleapis.com',
      },
    ],
  },
};

export default nextConfig;
