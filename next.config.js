/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // SWC minifier corrupts nested-backtick template strings in @radix-ui packages; use terser.
  swcMinify: false,
};

module.exports = nextConfig;
