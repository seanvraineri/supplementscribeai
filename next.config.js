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
  webpack: (config, { isServer }) => {
    // Fix for PDF.js in Next.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig 