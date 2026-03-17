# 🖥️ 技术博客 - GitHub Pages 版本

一个基于 Next.js 的静态技术博客，完全支持 GitHub Pages 部署。

## 功能特性

- ✅ 静态生成（SSG）- 完全兼容 GitHub Pages
- ✅ Markdown 文章管理
- ✅ 自动化部署（GitHub Actions）
- ✅ 暗黑主题 UI
- ✅ 分类与标签系统
- ✅ 响应式设计

## 项目结构

```
技术博客/
├── app/                 # Next.js 应用
│   ├── layout.js       # 根布局
│   ├── page.js         # 首页
│   └── posts/
│       └── [slug]/
│           └── page.js # 文章详情页
├── components/         # React 组件
│   └── Navbar.js
├── lib/               # 工具函数
│   └── posts.js       # 文章处理
├── posts/             # Markdown 文章存储
│   └── welcome.md
├── styles/            # 全局样式
├── public/            # 静态资源
├── next.config.js     # Next.js 配置
└── package.json
```

## 快速开始

### 1. 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 2. 写文章

在 `posts/` 目录下创建 Markdown 文件：

```markdown
---
title: 我的第一篇文章
date: 2026-03-17
category: 前端
tags: [React, JavaScript]
---

## 文章内容

用 Markdown 语法写作...
```

### 3. 本地构建

```bash
npm run build
```

### 4. 部署到 GitHub Pages

#### 方式 A：自动部署（推荐）

1. 将项目推送到 GitHub
2. 在 GitHub 仓库设置中启用 GitHub Pages
3. 选择 `gh-pages` 分支作为发布源
4. 每次 push 到 main 分支时自动部署

#### 方式 B：手动部署

```bash
# 构建并生成静态文件
npm run build

# 提交到 GitHub
git add .
git commit -m "Deploy blog"
git push origin main
```

## 配置 GitHub Pages

1. 进入仓库 Settings → Pages
2. Source 选择 "Deploy from a branch"
3. Branch 选择 "gh-pages" 和 "/ (root)"
4. 保存

## Markdown 语法

支持完整的 GFM（GitHub Flavored Markdown）：

- `# 标题` — 一级标题
- `**加粗**` — 粗体
- `` ```js `` — 代码块
- `> 引用` — 引用块
- `| 表格 |` — 表格
- `- 列表` — 无序列表

## 环境变量

如果需要自定义基础路径（非根域名部署）：

```bash
# .env.local
NEXT_PUBLIC_BASE_PATH=/your-repo-name
```

## 常见问题

**Q: 如何修改博客标题？**
A: 编辑 `app/layout.js` 中的 metadata

**Q: 如何添加自定义域名？**
A: 在 GitHub Pages 设置中配置自定义域名

**Q: 如何修改主题颜色？**
A: 编辑 `styles/globals.css` 中的 CSS 变量

## 许可证

MIT
