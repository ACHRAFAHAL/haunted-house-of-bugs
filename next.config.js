/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: false,
  },
  images: {
    domains: ['lh3.googleusercontent.com'], // For Google profile images
  },
  env: {
    CUSTOM_KEY: 'haunted-house-of-bugs',
  },
  // Enable source maps in development
  productionBrowserSourceMaps: false,
  
  // Optimize bundle
  webpack: (config, { dev, isServer }) => {
    // Monaco editor optimization
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig