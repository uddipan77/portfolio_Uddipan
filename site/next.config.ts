import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Make a static export into /out
  output: "export",

  // You’re deploying to a GitHub *project* page:
  // https://uddipan77.github.io/portfolio_Uddipan
  // so assets must be served from that subpath.
  basePath: "/portfolio_Uddipan",
  assetPrefix: "/portfolio_Uddipan/",

  // next/image without the optimization server
  images: { unoptimized: true },

  // Optional: don’t fail CI on lint
  // eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
