
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
    
    // Turbopack (Next.js 13+)
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    

  },
  
  // Image optimization
  images: {
    domains: [
      'api.re-commerce.com',
      'cdn.re-commerce.com',
      'staging-api.re-commerce.com',
      'localhost',
      's3.amazonaws.com',
      'your-bucket.s3.amazonaws.com'
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [320, 420, 768, 1024, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 hours
  },

  // Rewrites för API proxy
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_BASE_URL || 'http://localhost:3001'}/api/:path*`,
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/auth/login',
        permanent: false,
      },
    ];
  },

  // Headers för säkerhet och prestanda
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Environment variables som ska vara tillgängliga på klientsidan
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },

  // Webpack konfiguration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimera bundle size
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      },
    };

    // Lägg till alias för enklare imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
      '@/components': require('path').resolve(__dirname, 'src/components'),
      '@/lib': require('path').resolve(__dirname, 'src/lib'),
      '@/hooks': require('path').resolve(__dirname, 'src/hooks'),
      '@/stores': require('path').resolve(__dirname, 'src/stores'),
      '@/types': require('path').resolve(__dirname, 'src/types'),
      '@/styles': require('path').resolve(__dirname, 'src/styles'),
    };

    // Bundle analyzer (endast i development)
    if (process.env.ANALYZE_BUNDLE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        })
      );
    }

    return config;
  },

  // Compiler options
  compiler: {
    // Ta bort console.log i produktion
    removeConsole: process.env.NODE_ENV === 'production',
    
    // Styled Components support
    styledComponents: true,
  },

  // Output konfiguration
  output: 'standalone',
  
  // Compression
  compress: true,
  
  // PoweredByHeader
  poweredByHeader: false,
  
  // Generate ETags
  generateEtags: true,
  
  // Page extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  
  // Trailing slash
  trailingSlash: false,
  
  // React strict mode
  reactStrictMode: true,
  
  // SWC minify
  swcMinify: true,
  
  // Typescript konfiguration
  typescript: {
    // Ignorera TypeScript errors under build (ej rekommenderat för produktion)
    ignoreBuildErrors: false,
  },
  
  // ESLint konfiguration
  eslint: {
    // Ignorera ESLint errors under build (ej rekommenderat för produktion)
    ignoreDuringBuilds: false,
    dirs: ['src', 'pages', 'components', 'lib', 'hooks'],
  },



  // Internationalization
  i18n: {
    locales: ['sv', 'en', 'no', 'da', 'fi'],
    defaultLocale: 'sv',
    localeDetection: false,
  },

  // Sass options
  sassOptions: {
    includePaths: [require('path').join(__dirname, 'src/styles')],
  },

  // Monitoring och analytics
  analyticsId: process.env.NEXT_PUBLIC_GA_ID,
  
  // Custom server
  useFileSystemPublicRoutes: true,
  
  // Asset prefix för CDN
  assetPrefix: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_CDN_URL : '',
  
  // Cross Origin
  crossOrigin: 'anonymous',
};

// Wrapper för att hantera olika miljöer
const withConfig = (config) => {
  // Development-specifik konfiguration
  if (process.env.NODE_ENV === 'development') {
    config.devIndicators = {
      buildActivity: true,
      buildActivityPosition: 'bottom-right',
    };
  }

  // Production-specifik konfiguration
  if (process.env.NODE_ENV === 'production') {
    // Lägg till Sentry eller andra production tools här
    config.productionBrowserSourceMaps = false;
  }

  return config;
};

module.exports = withConfig(nextConfig);
