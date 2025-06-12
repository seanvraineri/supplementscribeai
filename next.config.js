/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignore TypeScript errors in scripts folder during build
    ignoreBuildErrors: false,
  },
  transpilePackages: [
    '@radix-ui/react-select',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui',
  ],
}

module.exports = nextConfig 