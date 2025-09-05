// site/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/portfolio_Uddipan",
  assetPrefix: "/portfolio_Uddipan/",
  images: { unoptimized: true },
  // eslint: { ignoreDuringBuilds: true }, // optional
};

export default nextConfig;
