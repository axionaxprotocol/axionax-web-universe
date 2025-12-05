const path = require('path')

/**
 * Next.js Configuration for axionax Web
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',

  // React strict mode for catching potential issues
  reactStrictMode: true,

  // Transpile workspace packages
  transpilePackages: ['@axionax/sdk', '@axionax/ui'],

  // Disable image optimization for simpler deployment
  images: {
    unoptimized: true,
  },

  // Skip ESLint during builds (run separately in CI)
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    // IMPORTANT: Set to monorepo root for pnpm compatibility
    // This ensures standalone output includes correct node_modules symlinks
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
}

module.exports = nextConfig
