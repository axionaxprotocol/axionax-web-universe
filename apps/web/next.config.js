/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  transpilePackages: ['@axionax/sdk', '@axionax/ui'],
  // Disable image optimization, as it's not supported with static export.
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
