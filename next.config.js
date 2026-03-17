/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/TechBlog',        // 替换为你的仓库名
  assetPrefix: '/TechBlog/',    // 替换为你的仓库名
  trailingSlash: true,
};

module.exports = nextConfig;
