/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ta bort output helt för standard Vercel deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;