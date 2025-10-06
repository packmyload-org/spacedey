import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbopack: {
      // Explicitly set project root to avoid incorrect workspace inference
      root: __dirname,
    },
  },
};

export default nextConfig;
