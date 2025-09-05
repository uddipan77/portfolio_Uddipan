// next.config.mjs (for GitHub Pages project site)
const isProd = process.env.NODE_ENV === "production";
const repo = "portfolio_Uddipan"; // <-- your repo name

/** @type {import('next').NextConfig} */
export default {
  output: "export",
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  images: { unoptimized: true },
};
