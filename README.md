# TechBlog - 个人技术博客

基于 Next.js 14 构建的静态技术博客，支持 Markdown 写作、LaTeX 公式、代码高亮、封面图，自动部署到 GitHub Pages。

**在线访问：** https://inzeroworld.com.cn/TechBlog/

---

## 目录

1. [快速开始](#1-快速开始)
2. [写博客文章](#2-写博客文章)
3. [文章元数据说明](#3-文章元数据说明)
4. [Markdown 语法](#4-markdown-语法)
5. [LaTeX 公式](#5-latex-公式)
6. [封面图设置](#6-封面图设置)
7. [更换背景图](#7-更换背景图)
8. [新建自定义页面](#8-新建自定义页面)
9. [博客个性化配置](#9-博客个性化配置)
10. [部署到 GitHub Pages](#10-部署到-github-pages)
11. [日常更新流程](#11-日常更新流程)
12. [项目结构](#12-项目结构)

---

## 1. 快速开始

### 环境要求

- Node.js 18.x 或以上
- Git

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/KiCola/TechBlog.git
cd TechBlog

# 安装依赖
npm install

# 启动本地开发服务器
npm run dev
```

打开浏览器访问 http://localhost:3000

---

## 2. 写博客文章

所有文章存放在 `posts/` 目录下，每篇文章是一个 `.md` 文件。

### 创建新文章

在 `posts/` 目录下新建一个 Markdown 文件，文件名即为文章的 URL：

```
posts/
├── my-first-post.md        → /posts/my-first-post
├── react-hooks-guide.md    → /posts/react-hooks-guide
└── algorithm-dp.md         → /posts/algorithm-dp
```

**文件名规范：**
- 使用英文和连字符（`-`）
- 全部小写
- 不要有空格或中文
- 例如：`deep-learning-intro.md`、`cpp-pointer-notes.md`

### 文章模板

```markdown
---
title: 文章标题
date: 2026-03-17
category: 分类名称
tags: [标签1, 标签2, 标签3]
cover: https://图片URL（可选）
---

## 第一个章节

正文内容从这里开始...
```

---

## 3. 文章元数据说明

每篇文章开头的 `---` 包裹部分叫做 **frontmatter**，用于设置文章属性：

| 字段 | 是否必填 | 类型 | 说明 | 示例 |
|------|---------|------|------|------|
| `title` | ✅ 必填 | 字符串 | 文章标题 | `title: 我学会了 React` |
| `date` | ✅ 必填 | 日期 | 发布日期，格式 YYYY-MM-DD | `date: 2026-03-17` |
| `category` | 可选 | 字符串 | 文章分类（只能填一个） | `category: 前端开发` |
| `tags` | 可选 | 数组 | 文章标签（可多个） | `tags: [React, Hook, JavaScript]` |
| `cover` | 可选 | URL | 封面图片地址 | `cover: https://...` |

### 分类（category）

分类用于首页的筛选按钮，同一篇文章只能属于一个分类：

```yaml
category: 前端开发
```

常用分类参考：`前端开发`、`后端开发`、`算法`、`机器学习`、`工具使用`、`读书笔记`、`随笔`

### 标签（tags）

标签显示在文章卡片和详情页底部，一篇文章可以有多个标签：

```yaml
# 单个标签
tags: [JavaScript]

# 多个标签
tags: [React, TypeScript, 前端工程化]

# 也可以这样写
tags:
  - React
  - TypeScript
  - Hooks
```

---

## 4. Markdown 语法

### 标题

```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
```

### 文字格式

```markdown
**加粗文字**
*斜体文字*
~~删除线~~
`行内代码`
```

### 链接与图片

```markdown
[链接文字](https://example.com)

![图片描述](图片URL)
![本地图片](/images/photo.jpg)
```

### 列表

```markdown
- 无序列表项 1
- 无序列表项 2
  - 嵌套列表项

1. 有序列表项 1
2. 有序列表项 2
```

### 引用

```markdown
> 这是一段引用文字
> 可以多行
```

### 代码块（支持语法高亮）

````markdown
​```javascript
function hello(name) {
  console.log(`Hello, ${name}!`);
}
```

```python
def hello(name):
    print(f"Hello, {name}!")
```

```bash
npm install react
```
````

支持的语言：`javascript`、`typescript`、`python`、`java`、`cpp`、`rust`、`go`、`bash`、`sql`、`html`、`css` 等

### 表格

​```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |
```

### 分割线

```markdown
---
```

---

## 5. LaTeX 公式

博客内置 KaTeX 支持，可以直接在 Markdown 中写数学公式。

### 行内公式

用单个 `$` 包裹，显示在文字中间：

```markdown
质能方程 $E = mc^2$ 是物理学基础。

二次方程求根公式：$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
```

### 块级公式

用 `$$` 包裹，单独成行居中显示：

```markdown
$$
\int_{-\infty}^{+\infty} e^{-x^2} dx = \sqrt{\pi}
$$

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$
```

### 常用 LaTeX 符号速查

| 效果 | 代码 |
|------|------|
| 分数 | `\frac{a}{b}` |
| 根号 | `\sqrt{x}` 、`\sqrt[n]{x}` |
| 求和 | `\sum_{i=1}^{n}` |
| 积分 | `\int_{a}^{b}` |
| 极限 | `\lim_{x \to 0}` |
| 偏导 | `\partial` |
| 无穷 | `\infty` |
| 希腊字母 | `\alpha`、`\beta`、`\gamma`、`\theta`、`\lambda`、`\mu`、`\sigma` |
| 向量 | `\mathbf{v}` 或 `\vec{v}` |
| 矩阵 | `\begin{pmatrix} a & b \\ c & d \end{pmatrix}` |
| 约等于 | `\approx` |
| 不等于 | `\neq` |
| 箭头 | `\rightarrow`、`\leftarrow`、`\Rightarrow` |

---

## 6. 封面图设置

在文章 frontmatter 中添加 `cover` 字段：

```yaml
---
title: 我的文章
date: 2026-03-17
cover: https://images.unsplash.com/photo-xxx?w=800&q=80
---
```

### 使用网络图片（推荐）

从以下免费图库获取图片链接：

- [Unsplash](https://unsplash.com) - 高质量免费图片，右键图片 → 复制图片地址
- [Pexels](https://pexels.com) - 免费商用图片

Unsplash 图片链接可以加参数控制尺寸：
```
https://images.unsplash.com/photo-xxx?w=800&q=80
                                       ↑宽度  ↑质量(0-100)
```

### 使用本地图片

1. 将图片放入 `public/images/` 目录
2. 在 frontmatter 中引用：

```yaml
cover: /images/my-cover.jpg
```

**注意**：部署到 GitHub Pages 后，本地图片路径需要加 `/TechBlog` 前缀：
```yaml
cover: /TechBlog/images/my-cover.jpg
```

### 不设置封面

不填写 `cover` 字段时，系统会根据文章分类自动生成渐变色占位封面。

---

## 7. 更换背景图

背景图在 `app/layout.js` 中配置，本地和线上路径自动区分。

### 使用本地图片

1. 将背景图片放入 `public/` 目录，例如 `public/bg.jpg`
2. 打开 `app/layout.js`，找到第 6-10 行，修改文件名：

```javascript
const bgStyle = `
  body {
    background-image:
      linear-gradient(rgba(13, 17, 23, 0.82), rgba(13, 17, 23, 0.82)),
      url('${basePath}/bg.jpg');   // ← 修改这里的文件名
  }
`;
```

### 使用网络图片

直接填写完整 URL，不需要 `basePath`：

```javascript
const bgStyle = `
  body {
    background-image:
      linear-gradient(rgba(13, 17, 23, 0.82), rgba(13, 17, 23, 0.82)),
      url('https://images.unsplash.com/photo-xxx?w=1920&q=80');
  }
`;
```

### 调整遮罩透明度

`rgba(13, 17, 23, 0.82)` 中最后的数字控制遮罩深度：

- `0.6` → 图片较亮，文字可能不清晰
- `0.82` → 默认，图片较暗，文字清晰
- `0.92` → 图片很暗，接近纯色背景

---

## 8. 新建自定义页面

### 新建普通页面

在 `app/` 目录下新建文件夹和 `page.js`，路径即为 URL：

```
app/about/page.js   →   /about
app/projects/page.js →  /projects
```

**示例：新建「关于我」页面**

创建 `app/about/page.js`：

```jsx
import '../styles/post.css';

export const metadata = {
  title: '关于我',
};

export default function AboutPage() {
  return (
    <div className="post-detail">
      <article className="post-article">
        <header className="post-header">
          <h1 className="post-title">关于我</h1>
        </header>
        <div className="post-content">
          <p>这里写你的自我介绍...</p>
          <p>研究方向：xxx</p>
          <p>联系方式：your@email.com</p>
        </div>
      </article>
    </div>
  );
}
```

### 在导航栏添加链接

编辑 `components/Navbar.js`，在 `navbar-links` 中添加：

```jsx
<div className="navbar-links">
  <Link href="/">首页</Link>
  <Link href="/about">关于我</Link>        {/* 新增 */}
  <Link href="/projects">项目</Link>      {/* 新增 */}
  <a href="https://github.com/KiCola" target="_blank" rel="noopener noreferrer" className="btn-github">
    ⭐ GitHub
  </a>
</div>
```

---

## 9. 博客个性化配置

### 修改博客标题和描述

编辑 `app/layout.js`：

```javascript
export const metadata = {
  title: {
    default: '你的博客名称',        // ← 修改
    template: '%s | 你的博客名称',  // ← 修改
  },
  description: '你的博客描述',      // ← 修改
};
```

### 修改导航栏 Logo

编辑 `components/Navbar.js`：

```jsx
<span className="brand-name">TechBlog</span>  {/* ← 改为你的名字 */}
```

### 修改 GitHub 链接

编辑 `components/Navbar.js`：

```jsx
<a href="https://github.com/你的用户名" ...>
```

### 修改主题颜色

编辑 `styles/globals.css` 中的 CSS 变量：

```css
:root {
  --accent: #58a6ff;        /* 主强调色（链接、按钮、标签）*/
  --accent-green: #3fb950;  /* 标签悬停色 */
  --accent-warm: #f78166;   /* 警告/删除色 */
  --bg-primary: #0d1117;    /* 主背景色 */
  --bg-card: #1c2128;       /* 卡片背景色 */
  --text-primary: #e6edf3;  /* 主文字色 */
  --text-secondary: #8b949e;/* 次要文字色 */
}
```

### 修改页脚文字

编辑 `app/layout.js`：

```jsx
<p>© {new Date().getFullYear()} 你的名字 · 你的口号</p>
```

---

## 10. 部署到 GitHub Pages

### 自动部署（每次 push 自动触发）

项目已配置 GitHub Actions，每次推送到 `main` 分支自动部署。

**首次配置：**

1. 进入 GitHub 仓库 → **Settings** → **Actions** → **General**
2. **Workflow permissions** 选择 `Read and write permissions` → **Save**
3. 进入 **Settings** → **Pages**
4. Source 设为 `gh-pages` 分支，`/ (root)` → **Save**

**之后每次更新只需：**

```bash
git add .
git commit -m "更新说明"
git push
```

2-5 分钟后访问 https://inzeroworld.com.cn/TechBlog/ 查看更新。

---

## 11. 日常更新流程

```
① 在 posts/ 目录新建或编辑 .md 文件
        ↓
② npm run dev  →  http://localhost:3000 预览（可选）
        ↓
③ git add .
   git commit -m "新增文章：xxx"
   git push
        ↓
④ GitHub Actions 自动构建（2-5 分钟）
        ↓
⑤ 访问 https://inzeroworld.com.cn/TechBlog/ 查看 ✅
```

### 常用 Git 命令

```bash
git status              # 查看改动状态
git add .               # 添加所有改动
git add posts/xxx.md    # 只添加指定文件
git commit -m "说明"    # 提交
git push                # 推送
git log --oneline       # 查看提交历史
```

---

## 12. 项目结构

```
TechBlog/
├── app/                        # Next.js 应用
│   ├── layout.js              # 全局布局（修改标题、背景图在这里）
│   ├── page.js                # 首页入口
│   └── posts/[slug]/page.js   # 文章详情页
├── components/
│   ├── Navbar.js              # 导航栏（修改链接、Logo 在这里）
│   └── HomeClient.js          # 首页客户端组件
├── lib/
│   └── posts.js               # 文章读取、Markdown + LaTeX 渲染
├── posts/                     # 📝 所有博客文章（在这里写文章）
│   ├── welcome.md
│   └── your-post.md
├── public/                    # 静态资源
│   └── bg.jpg                 # 背景图片
├── styles/
│   ├── globals.css            # 全局样式和 CSS 变量
│   ├── home.css               # 首页样式
│   ├── post.css               # 文章详情页样式
│   └── navbar.css             # 导航栏样式
├── .github/workflows/
│   └── deploy.yml             # GitHub Actions 自动部署配置
├── next.config.js             # Next.js 配置（basePath 等）
└── package.json
```

---

## 常见问题

**Q: 文章不显示？**
A: 检查文件名是否为英文、frontmatter 格式是否正确（特别是 `date` 字段格式）。

**Q: LaTeX 公式显示不正常？**
A: 确保公式内的 `_` 和 `^` 没有被 Markdown 解析，可以用 `\` 转义特殊字符。

**Q: 本地正常但线上样式乱了？**
A: 检查 `next.config.js` 中的 `basePath` 是否为 `/TechBlog`。

**Q: 推送后多久能看到更新？**
A: 通常 2-5 分钟，可在仓库 Actions 标签查看进度。

**Q: 如何删除文章？**
A: 删除 `posts/` 目录下对应的 `.md` 文件，然后 push。

---

*Built with [Next.js](https://nextjs.org) · Deployed on [GitHub Pages](https://pages.github.com)*

