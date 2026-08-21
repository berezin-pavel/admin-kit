import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    turbopackMemoryLimit: 1024 * 1024 * 1024,
    turbopackFileSystemCacheForDev: false,
  },
}

export default nextConfig
