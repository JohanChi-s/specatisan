const webpackNodeExternals = require('webpack-node-externals');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponents: true, // Enable Server Components
    serverActions: true, // Enable Server Actions
  },
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.externals = [webpackNodeExternals()];
  //   }

  //   return config;
  // },
  images: {
    domains: ['lzikiidzevbmtqyuqhgk.supabase.co'],
  },
};

module.exports = nextConfig;
