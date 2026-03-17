# 🚀 快速开始指南

## 第一步：安装依赖

### Windows 用户
双击运行 `install.bat` 文件，或在命令行执行：
```bash
npm install
```

### Mac/Linux 用户
```bash
bash install.sh
# 或
npm install
```

## 第二步：本地开发

```bash
npm run dev
```

打开浏览器访问 http://localhost:3000

## 第三步：写你的第一篇文章

在 `posts/` 目录下创建一个新的 Markdown 文件，例如 `my-first-post.md`：

```markdown
---
title: 我的第一篇技术文章
date: 2026-03-17
category: 前端开发
tags: [React, Next.js, 博客]
---

## 介绍

这是我的第一篇技术文章。

## 代码示例

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

## 总结

写作愉快！
```

**重要：** 文件名会自动成为 URL slug，例如 `my-first-post.md` 对应 `/posts/my-first-post`

## 第四步：本地构建

```bash
npm run build
```

这会生成静态 HTML 文件到 `out/` 目录

## 第五步：部署到 GitHub Pages

### 方式 1：自动部署（推荐）

1. 在 GitHub 创建新仓库，名称为 `username.github.io`（替换 username）
2. 将本地项目推送到 GitHub：
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/username.github.io.git
git branch -M main
git push -u origin main
```

3. GitHub Actions 会自动构建并部署
4. 访问 https://username.github.io 查看你的博客

### 方式 2：部署到子路径

如果仓库名不是 `username.github.io`，例如 `my-blog`：

1. 编辑 `next.config.js`：
```javascript
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/my-blog',
  trailingSlash: true,
};
```

2. 推送到 GitHub
3. 访问 https://username.github.io/my-blog

## 文章 Frontmatter 说明

每篇文章的开头需要包含 YAML frontmatter：

```yaml
---
title: 文章标题（必需）
date: 2026-03-17（必需，格式：YYYY-MM-DD）
category: 分类（可选，默认：未分类）
tags: [标签1, 标签2]（可选，数组格式）
---
```

## 支持的 Markdown 语法

- **标题**：`# H1`, `## H2`, `### H3`
- **强调**：`**加粗**`, `*斜体*`, `~~删除线~~`
- **代码**：`` `行内代码` ``, ` ```js 代码块 ``` `
- **列表**：`- 项目`, `1. 有序项`
- **引用**：`> 引用文本`
- **链接**：`[文字](url)`
- **图片**：`![alt](url)`
- **表格**：
```
| 列1 | 列2 |
|-----|-----|
| 数据 | 数据 |
```

## 常见问题

**Q: 如何修改博客标题和描述？**
A: 编辑 `app/layout.js` 中的 metadata 对象

**Q: 如何修改主题颜色？**
A: 编辑 `styles/globals.css` 中的 CSS 变量（`:root` 部分）

**Q: 如何添加自定义域名？**
A: 
1. 在 GitHub 仓库 Settings → Pages 中配置
2. 在你的域名 DNS 设置中添加 CNAME 记录

**Q: 文章发布后多久能看到？**
A: GitHub Actions 通常需要 1-2 分钟完成构建和部署

**Q: 如何删除文章？**
A: 删除 `posts/` 目录下对应的 Markdown 文件，然后 push 到 GitHub

**Q: 如何修改文章发布日期？**
A: 编辑 Markdown 文件的 `date` 字段，文章会按日期倒序排列

## 项目文件说明

```
├── app/                    # Next.js 应用目录
│   ├── layout.js          # 根布局（修改标题在这里）
│   ├── page.js            # 首页
│   └── posts/[slug]/page.js # 文章详情页
├── components/            # React 组件
│   └── Navbar.js          # 导航栏
├── lib/                   # 工具函数
│   └── posts.js           # 文章读取和处理
├── posts/                 # 📝 你的 Markdown 文章存放处
├── styles/                # 全局样式
├── public/                # 静态资源
├── next.config.js         # Next.js 配置
└── package.json           # 项目依赖
```

## 开发工作流

1. 编写 Markdown 文章到 `posts/` 目录
2. 运行 `npm run dev` 本地预览
3. 满意后 commit 并 push 到 GitHub
4. GitHub Actions 自动构建部署
5. 访问你的博客查看更新

祝你写作愉快！🎉

