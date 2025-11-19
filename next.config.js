/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Performance optimizations
  reactStrictMode: true,
  swcMinify: true,
  
  // Compiler optimizations for faster builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Webpack optimizations (only if not using Turbopack)
  webpack: (config, { dev, isServer }) => {
    // Optimize module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
    }
    
    // Faster refresh in development
    if (dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      }
    }
    
    // Optimize react-icons imports
    config.module.rules.push({
      test: /node_modules[\\/]react-icons[\\/]/,
      sideEffects: false,
    })
    
    return config
  },
  
  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-icons', 'date-fns'],
    // Enable Turbopack for faster builds (Next.js 14+)
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Faster development builds
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
  }),
}

module.exports = nextConfig
