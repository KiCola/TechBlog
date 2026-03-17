# TechBlog 技术架构文档

## 1. 技术栈概览

| 层次 | 技术 | 版本 | 作用 |
|------|------|------|------|
| 框架 | Next.js | 14.x | 静态站点生成（SSG） |
| UI | React | 18.x | 组件化界面 |
| 样式 | CSS Modules / 全局 CSS | - | 页面样式 |
| Markdown | marked | 11.x | Markdown → HTML |
| 数学公式 | KaTeX | 0.16.x | LaTeX 渲染 |
| 元数据 | gray-matter | 4.x | 解析 frontmatter |
| 部署 | GitHub Actions + GitHub Pages | - | CI/CD 自动部署 |

---

## 2. 项目目录结构

```
TechBlog/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD 自动部署配置
├── app/                        # Next.js App Router
│   ├── layout.js               # 根布局：全局样式、字体、背景图注入
│   ├── page.js                 # 首页：服务端读取文章列表
│   └── posts/
│       └── [slug]/
│           └── page.js         # 动态路由：文章详情页
├── components/
│   ├── Navbar.js               # 导航栏（客户端组件，含滚动监听）
│   └── HomeClient.js           # 首页客户端组件（含分类筛选状态）
├── lib/
│   └── posts.js                # 核心：文章读取、Markdown+LaTeX 渲染管道
├── posts/                      # Markdown 文章源文件
├── public/                     # 静态资源（图片等）
├── styles/
│   ├── globals.css             # CSS 变量、body 背景、全局重置
│   ├── app.css                 # 布局容器、footer
│   ├── navbar.css              # 导航栏样式
│   ├── home.css                # 首页、Hero、卡片网格样式
│   └── post.css                # 文章详情页、Markdown 内容样式
├── jsconfig.json               # 路径别名配置
├── next.config.js              # Next.js 配置（输出模式、basePath）
└── package.json
```

---

## 3. 核心架构：静态生成（SSG）

### 3.1 工作原理

```
构建时（npm run build）：

  posts/*.md 文件
       ↓
  lib/posts.js 读取并解析
       ↓
  generateStaticParams() 生成所有路由
       ↓
  每个路由预渲染为静态 HTML
       ↓
  输出到 out/ 目录
       ↓
  部署到 GitHub Pages（纯静态文件）
```

运行时**无需服务器**，所有内容在构建时生成。

### 3.2 Next.js 配置

```javascript
// next.config.js
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',          // 启用静态导出
  images: {
    unoptimized: true,       // 关闭图片优化（GitHub Pages 不支持）
  },
  basePath: isProd ? '/TechBlog' : '',     // 子路径部署
  assetPrefix: isProd ? '/TechBlog/' : '', // 静态资源前缀
  trailingSlash: true,       // URL 末尾加斜杠（GitHub Pages 兼容）
};
```

**关键配置说明：**
- `output: 'export'`：构建时生成纯静态 HTML/CSS/JS，无需 Node.js 服务器
- `basePath`：仓库名为 `TechBlog` 而非 `username.github.io`，需要子路径
- `trailingSlash`：确保 `/posts/slug/` 形式的 URL 在 GitHub Pages 上正确解析

---

## 4. 文章渲染管道（lib/posts.js）

### 4.1 完整处理流程

```
原始 Markdown 文件
        ↓
1. gray-matter 分离 frontmatter 和正文
        ↓
2. 抽取代码块 → 占位符 %%CODE0%%（保护 $ 不被误处理）
        ↓
3. 抽取 $$块级公式$$ → 占位符 %%MATH0%%
        ↓
4. 抽取 $行内公式$ → 占位符 %%MATH1%%
        ↓
5. 还原代码块
        ↓
6. marked 渲染 Markdown → HTML
        ↓
7. 将 KaTeX 渲染结果替换回占位符
        ↓
最终 HTML（含代码块 + 数学公式）
```

### 4.2 关键代码解析

```javascript
// 保护顺序至关重要：
// 代码块 > 块级公式 > 行内公式 > Markdown
// 防止 Markdown 的 _ * 语法破坏公式内容

function renderContent(content) {
  const placeholders = [];
  const codeBlocks = [];

  // Step 1: 保护代码块
  let protected_ = content.replace(
    /(```[\s\S]*?```|`[^`\n]+`)/g,
    (match) => {
      codeBlocks.push(match);
      return `%%CODE${codeBlocks.length - 1}%%`;
    }
  );

  // Step 2: 块级公式 $$...$$
  protected_ = protected_.replace(/\$\$([\s\S]+?)\$\$/g, (_, formula) => {
    placeholders.push(renderFormula(formula, true));
    return `%%MATH${placeholders.length - 1}%%`;
  });

  // Step 3: 行内公式 $...$
  protected_ = protected_.replace(
    /\$(?!\$)(?!\s)((?:[^$\\\n]|\\[\s\S])+?)(?!\s)\$/g,
    (_, formula) => {
      placeholders.push(renderFormula(formula, false));
      return `%%MATH${placeholders.length - 1}%%`;
    }
  );

  // Step 4-6: 还原、渲染、替换
  protected_ = protected_.replace(/%%CODE(\d+)%%/g, (_, i) => codeBlocks[+i]);
  let html = marked(protected_);
  html = html.replace(/%%MATH(\d+)%%/g, (_, i) => placeholders[+i]);
  return html;
}
```

---

## 5. 路由系统

### 5.1 路由映射

| 文件路径 | URL | 渲染方式 |
|---------|-----|----------|
| `app/page.js` | `/` | 服务端组件（构建时） |
| `app/posts/[slug]/page.js` | `/posts/:slug` | 动态路由（构建时全量生成） |

### 5.2 动态路由生成

```javascript
// app/posts/[slug]/page.js
export async function generateStaticParams() {
  const posts = getAllPosts();
  // 构建时为每篇文章生成一个静态页面
  return posts.map(post => ({ slug: post.slug }));
}
```

### 5.3 服务端 / 客户端组件拆分

| 组件 | 类型 | 原因 |
|------|------|------|
| `app/page.js` | 服务端 | 需要读取文件系统（fs 模块） |
| `app/posts/[slug]/page.js` | 服务端 | 需要读取文件系统 |
| `components/HomeClient.js` | 客户端 | 需要 useState（分类筛选交互） |
| `components/Navbar.js` | 客户端 | 需要 useEffect（滚动监听） |

> Next.js 规则：fs、path 等 Node.js 模块只能在服务端组件中使用；useState、useEffect 只能在客户端组件（`'use client'`）中使用。

---

## 6. 样式系统

### 6.1 CSS 变量（设计 Token）

所有颜色、字体、间距通过 `styles/globals.css` 中的 CSS 变量统一管理：

```css
:root {
  /* 背景色系 */
  --bg-primary: #0d1117;    /* 页面主背景 */
  --bg-secondary: #161b22;  /* 次级背景（代码块等） */
  --bg-card: #1c2128;       /* 卡片背景 */

  /* 边框 */
  --border: #30363d;

  /* 强调色 */
  --accent: #58a6ff;        /* 主强调色（链接、按钮） */
  --accent-warm: #f78166;   /* 暖色强调（警告、删除） */
  --accent-green: #3fb950;  /* 绿色强调（成功、标签） */

  /* 文字色系 */
  --text-primary: #e6edf3;
  --text-secondary: #8b949e;
  --text-muted: #484f58;

  /* 字体 */
  --font-code: 'JetBrains Mono', monospace;  /* 代码 */
  --font-serif: 'Noto Serif SC', serif;       /* 标题 */
  --font-sans: 'Noto Sans SC', sans-serif;    /* 正文 */

  /* 其他 */
  --radius: 8px;
  --transition: 0.2s ease;
}
```

### 6.2 背景图实现原理

背景图通过 `app/layout.js` 动态注入 `<style>` 标签，实现本地开发和 GitHub Pages 路径自动切换：

```javascript
// 生产环境加 basePath 前缀，开发环境不加
const basePath = process.env.NODE_ENV === 'production' ? '/TechBlog' : '';

const bgStyle = `
  body {
    background-image:
      linear-gradient(rgba(13,17,23,0.82), rgba(13,17,23,0.82)),
      url('${basePath}/bg.jpg');
    background-size: cover;
    background-attachment: fixed;  /* 视差滚动效果 */
  }
`;
```

### 6.3 毛玻璃卡片效果

```css
.post-card {
  background: rgba(28, 33, 40, 0.75);    /* 半透明背景 */
  backdrop-filter: blur(16px);            /* 毛玻璃模糊 */
  -webkit-backdrop-filter: blur(16px);   /* Safari 兼容 */
  border: 1px solid rgba(255,255,255,0.08);
}
```

---

## 7. CI/CD 自动部署

### 7.1 GitHub Actions 工作流

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]   # main 分支有推送时触发

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write   # 需要写入 gh-pages 分支的权限
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm install
      - run: npm run build      # 生成 out/ 目录
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out    # 将 out/ 部署到 gh-pages 分支
          force_orphan: true    # gh-pages 始终只保留最新版本
```

### 7.2 部署流程图

```
git push origin main
        ↓
GitHub Actions 触发
        ↓
ubuntu-latest 虚拟机启动
        ↓
actions/checkout  →  拉取代码
        ↓
setup-node        →  安装 Node.js 20
        ↓
npm install       →  安装依赖
        ↓
npm run build     →  Next.js 静态构建 → 生成 out/
        ↓
actions-gh-pages  →  将 out/ 推送到 gh-pages 分支
        ↓
GitHub Pages      →  从 gh-pages 分支发布
        ↓
https://inzeroworld.com.cn/TechBlog/ 更新 ✅
```

### 7.3 构建产物结构（out/ 目录）

```
out/
├── index.html              # 首页
├── posts/
│   ├── welcome/
│   │   └── index.html      # /posts/welcome 页面
│   └── my-post/
│       └── index.html      # /posts/my-post 页面
├── _next/
│   └── static/             # JS、CSS 静态资源
└── bg.jpg                  # public/ 目录下的静态文件
```

---

## 8. 文章数据流

```
写作阶段：
  posts/my-article.md
  ┌─────────────────────────────────┐
  │ ---                             │
  │ title: 文章标题                  │  ← frontmatter（元数据）
  │ date: 2026-03-17                │
  │ category: 前端开发               │
  │ tags: [React, TypeScript]       │
  │ cover: https://...              │
  │ ---                             │
  │                                 │
  │ ## 正文标题                      │  ← content（正文）
  │ 正文内容 $E=mc^2$ ...           │
  └─────────────────────────────────┘

构建阶段（lib/posts.js）：
  gray-matter 解析
  ┌──────────────────┬──────────────────────┐
  │  data（元数据）   │   content（Markdown） │
  │  title           │   ## 正文标题         │
  │  date            │   正文内容...         │
  │  category        │   $E=mc^2$           │
  │  tags            │                      │
  └──────────────────┴──────────────────────┘
           ↓                    ↓
    直接返回字段          renderContent()
                               ↓
                         最终 HTML 字符串

页面渲染：
  app/page.js            →  getAllPosts()  →  文章列表
  app/posts/[slug]/page.js →  getPostBySlug() →  文章详情
```

---

## 9. 性能优化

| 优化项 | 实现方式 | 效果 |
|--------|---------|------|
| 静态生成 | `output: 'export'` | 无服务器计算，极速响应 |
| 字体预连接 | `<link rel="preconnect">` | 减少字体加载延迟 |
| 图片不优化 | `unoptimized: true` | 兼容静态托管 |
| CSS 变量 | `:root` 统一管理 | 避免重复计算 |
| 卡片动画延迟 | `animation-delay` | 错开动画，视觉流畅 |
| 背景固定 | `background-attachment: fixed` | 视差效果，GPU 加速 |

---

## 10. 扩展指南

### 10.1 添加新页面

在 `app/` 下新建目录和 `page.js`：

```javascript
// app/about/page.js
export const metadata = { title: '关于我' };

export default function AboutPage() {
  return <div>...</div>;
}
```

### 10.2 添加新功能的原则

- **需要读文件** → 在服务端组件（无 `'use client'`）中处理
- **需要交互/状态** → 创建客户端组件（添加 `'use client'`），从服务端组件接收 props
- **新增样式** → 优先使用现有 CSS 变量，保持主题一致性
- **新增文章字段** → 在 `lib/posts.js` 的 `getAllPosts` 和 `getPostBySlug` 中同时添加

### 10.3 本地调试命令

```bash
npm run dev      # 开发服务器，热重载
npm run build    # 本地构建，验证生产环境是否正常
npm run start    # 启动生产服务器预览（需先 build）
```

---

## 11. 依赖说明

```json
{
  "dependencies": {
    "next": "^14.0.0",        // 核心框架
    "react": "^18.2.0",       // UI 库
    "react-dom": "^18.2.0",   // React DOM 渲染
    "gray-matter": "^4.0.3",  // 解析 Markdown frontmatter
    "marked": "^11.1.1",      // Markdown → HTML
    "katex": "^0.16.x",       // LaTeX 数学公式渲染
    "remark": "^15.0.0",      // 备用 Markdown 处理
    "remark-html": "^16.0.0"  // remark → HTML 插件
  },
  "devDependencies": {
    "autoprefixer": "^10.4.16", // CSS 自动补全浏览器前缀
    "postcss": "^8.4.31"        // CSS 处理工具链
  }
}
```

---

*文档版本：v1.0 · 2026-03-17*

