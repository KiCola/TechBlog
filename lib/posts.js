import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import katex from 'katex';

const postsDirectory = path.join(process.cwd(), 'posts');
const basePath = process.env.NODE_ENV === 'production' ? '/TechBlog' : '';

// 修正图片路径：给 /xxx 形式的本地路径加上 basePath 前缀
function fixImagePaths(cover) {
  if (!cover) return null;
  // 已经是完整 URL 或已有前缀，不处理
  if (cover.startsWith('http') || cover.startsWith(basePath)) return cover;
  // 本地路径加前缀
  return `${basePath}${cover}`;
}

// 渲染单个 LaTeX 公式字符串
function renderFormula(formula, displayMode) {
  try {
    return katex.renderToString(formula.trim(), {
      displayMode,
      throwOnError: false,
      output: 'html',
    });
  } catch (e) {
    return `<span class="katex-error">${formula}</span>`;
  }
}

// 将 Markdown + LaTeX 转换为 HTML
function renderContent(content) {
  const placeholders = [];
  const codeBlocks = [];

  // 1. 保护代码块
  let protected_ = content.replace(
    /(```[\s\S]*?```|`[^`\n]+`)/g,
    (match) => {
      const idx = codeBlocks.push(match) - 1;
      return `%%CODE${idx}%%`;
    }
  );

  // 2. 抽取块级公式 $$...$$
  protected_ = protected_.replace(/\$\$([\s\S]+?)\$\$/g, (_, formula) => {
    const idx = placeholders.push(renderFormula(formula, true)) - 1;
    return `%%MATH${idx}%%`;
  });

  // 3. 抽取行内公式 $...$
  protected_ = protected_.replace(
    /\$(?!\$)(?!\s)((?:[^$\\\n]|\\[\s\S])+?)(?!\s)\$/g,
    (_, formula) => {
      const idx = placeholders.push(renderFormula(formula, false)) - 1;
      return `%%MATH${idx}%%`;
    }
  );

  // 4. 还原代码块
  protected_ = protected_.replace(/%%CODE(\d+)%%/g, (_, i) => codeBlocks[+i]);

  // 5. 渲染 Markdown
  let html = marked(protected_);

  // 6. 还原数学公式
  html = html.replace(/%%MATH(\d+)%%/g, (_, i) => placeholders[+i]);

  return html;
}

function cleanExcerpt(content) {
  return content
    .replace(/\$\$[\s\S]+?\$\$/g, '')
    .replace(/\$[^$\n]+?\$/g, '')
    .replace(/[#*`>[\]!]/g, '')
    .substring(0, 200)
    .trim();
}

export function getAllPosts() {
  const files = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'));

  const posts = files.map(file => {
    const fullPath = path.join(postsDirectory, file);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug: file.replace('.md', ''),
      title: data.title || '无标题',
      date: data.date || new Date().toISOString(),
      category: data.category || '未分类',
      tags: data.tags || [],
      cover: fixImagePaths(data.cover || null),
      excerpt: cleanExcerpt(content),
      content: renderContent(content),
    };
  });

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || '无标题',
    date: data.date || new Date().toISOString(),
    category: data.category || '未分类',
    tags: data.tags || [],
    cover: fixImagePaths(data.cover || null),
    excerpt: cleanExcerpt(content),
    content: renderContent(content),
  };
}
