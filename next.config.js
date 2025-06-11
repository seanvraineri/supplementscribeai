/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignore TypeScript errors in scripts folder during build
    ignoreBuildErrors: false,
  },
  // Exclude scripts from TypeScript checking
  exclude: ['scripts/**/*'],
}

module.exports = nextConfig 