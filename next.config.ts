import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  // Don't bundle @react-pdf/renderer in server bundle
  // This prevents Turbopack from trying to bundle Node.js-specific modules
  serverExternalPackages: ['@react-pdf/renderer'],
};

export default nextConfig;
