---
title: Next.js 静态博客搭建指南
date: 2026-03-17
category: 技术教程
tags: [Next.js, 博客, GitHub Pages]
---

## 什么是静态博客？

静态博客是指在构建时就生成所有 HTML 文件，无需服务器动态处理请求。这种方式有以下优势：

- 🚀 **超快速度**：直接加载 HTML，无需数据库查询
- 🔒 **更安全**：没有后端服务器，减少攻击面
- 💰 **免费托管**：GitHub Pages 完全免费
- 📱 **SEO 友好**：所有内容都是静态 HTML，搜索引擎易于索引

## 为什么选择 Next.js？

Next.js 提供了完美的静态生成能力：

```javascript
// next.config.js
const nextConfig = {
  output: 'export',  // 启用静态导出
  images: {
    unoptimized: true,  // 不优化图片
  },
};
```

## 项目架构

```
posts/
├── welcome.md
├── my-first-post.md
└── another-article.md

app/
├── layout.js          # 全局布局
├── page.js            # 首页（列表）
└── posts/[slug]/page.js  # 文章详情页

lib/
└── posts.js           # 读取和解析 Markdown
```

## 核心功能实现

### 1. 读取 Markdown 文件

```javascript
// lib/posts.js
import fs from 'fs';
import matter from 'gray-matter';

export function getAllPosts() {
  const files = fs.readdirSync('posts');
  return files.map(file => {
    const content = fs.readFileSync(`posts/${file}`, 'utf8');
    const { data, content: body } = matter(content);
    return { ...data, content: body };
  });
}
```

### 2. 生成静态路由

```javascript
// app/posts/[slug]/page.js
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({
    slug: post.slug,
  }));
}
```

### 3. 渲染 Markdown

```javascript
import { marked } from 'marked';

const html = marked(markdownContent);
```

## 部署流程

### GitHub Actions 自动化

每次 push 到 main 分支时：

1. 安装依赖
2. 运行 `npm run build`
3. 生成 `out/` 目录
4. 部署到 `gh-pages` 分支
5. GitHub Pages 自动发布

```yaml
# .github/workflows/deploy.yml
- name: Build
  run: npm run build

- name: Deploy
  uses: peaceiris/actions-gh-pages@v3
  with:
    publish_dir: ./out
```

## 性能优化

- ✅ 静态 HTML - 无需服务器计算
- ✅ CSS 内联 - 减少 HTTP 请求
- ✅ 图片优化 - 使用现代格式
- ✅ 代码分割 - 按需加载

## 总结

这个博客系统提供了：

- 📝 简单的 Markdown 写作体验
- 🎨 现代化的暗黑主题 UI
- 🚀 一键部署到 GitHub Pages
- 📊 完整的分类和标签系统
- 🔍 SEO 友好的静态生成

开始写作吧！

