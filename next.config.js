/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isProd ? '/TechBlog' : '',
  assetPrefix: isProd ? '/TechBlog/' : '',
  trailingSlash: true,
};

module.exports = nextConfig;
