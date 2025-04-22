/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Only on the client side, ignore problematic libsql dependencies
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@prisma/adapter-libsql': false,
        '@libsql/client': false,
      };
    }
    
    // Properly handle README.md files in dependencies
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/resource',
    });

    return config;
  },
};

module.exports = nextConfig; 