/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Only on the client side, ignore problematic dependencies
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@prisma/adapter-libsql': false,
          '@libsql/client': false,
          '@libsql/core': false,
          '@libsql/hrana-client': false,
          '@libsql/isomorphic-fetch': false,
          '@libsql/isomorphic-ws': false,
          'libsql': false,
        },
        // Ignore specific file extensions
        fallback: {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
          child_process: false,
        },
      };
    }
    
    // Handle non-standard file types
    config.module.rules.push(
      {
        test: /\.(md|LICENSE|txt)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.node$/,
        use: 'file-loader',
        type: 'javascript/auto',
      },
      {
        test: /\.d\.ts$/,
        loader: 'ignore-loader',
      }
    );

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/adapter-libsql', '@libsql/client'],
  },
};

module.exports = nextConfig; 