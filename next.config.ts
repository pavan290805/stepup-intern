import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    workerThreads: true,
  },
  serverExternalPackages: ["pdf-parse", "mammoth"],
};

export default nextConfig;
