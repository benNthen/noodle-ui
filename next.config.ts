import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '192.168.0.0/16',
    '10.0.0.0/8',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'abs.twimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'a.thumbs.redditmedia.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3-symbol-logo.tradingview.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'b.thumbs.redditmedia.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd14ciuzrn5ydd5.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'icons.llamao.fi',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.redd.it',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
