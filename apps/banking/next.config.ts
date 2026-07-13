import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Internal packages are consumed as TypeScript source (F001) — no build step.
  transpilePackages: [
    "@idbi/analytics",
    "@idbi/api-client",
    "@idbi/config",
    "@idbi/financial-domain",
    "@idbi/test-fixtures",
    "@idbi/types",
    "@idbi/validation",
  ],
};

export default nextConfig;
