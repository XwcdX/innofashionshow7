import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['app', 'pages', 'components'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig