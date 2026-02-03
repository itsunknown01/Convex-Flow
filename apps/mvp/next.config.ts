/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  output: "standalone",
  experimental: {
    // Vercel React Best Practices: Avoid barrel file imports
    // Transforms `import { X } from 'lucide-react'` to direct imports
    // Reduces bundle size and improves cold start by 200-800ms
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
