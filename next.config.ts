import type { NextConfig } from "next";

// GitHub Pages serves project sites from https://<user>.github.io/<repo>/.
// The workflow sets NEXT_PUBLIC_BASE_PATH to "/<repo>"; local dev leaves it empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";

const nextConfig: NextConfig = {
  // Fully static output: the whole site is prerendered into ./out.
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  basePath: basePath || undefined,
  images: {
    // No image optimisation server on GitHub Pages.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
