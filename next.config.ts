import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
}

export default nextConfig
