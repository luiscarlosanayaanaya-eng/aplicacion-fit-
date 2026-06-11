import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@forja/ui", "@forja/auth", "@forja/db", "@forja/validators"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
    ],
  },
  serverExternalPackages: ["postgres"],
};

export default nextConfig;
