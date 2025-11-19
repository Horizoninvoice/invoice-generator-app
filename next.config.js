/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Performance optimizations
  reactStrictMode: true,
  swcMinify: true,
  // Optimize bundle size
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig

