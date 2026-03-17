const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const matter = require('gray-matter');
const { marked } = require('marked');

const app = express();
const PORT = 5000;

// marked 配置
marked.setOptions({
  breaks: true,
  gfm: true,
});

// 中间件
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 配置上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({ storage });

// 确保必要的目录存在
const postsDir = path.join(__dirname, '../posts');
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

// 获取所有博客文章
app.get('/api/posts', (req, res) => {
  try {
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
    const posts = files.map(file => {
      const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
      const { data, content: body } = matter(content);
      return {
        id: file.replace('.md', ''),
        ...data,
        excerpt: body.replace(/[#*`>\[\]!]/g, '').substring(0, 200).trim()
      };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单篇文章（渲染后的HTML）
app.get('/api/posts/:id', (req, res) => {
  try {
    const filePath = path.join(postsDir, `${req.params.id}.md`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: '文章不存在' });
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const { data, content: body } = matter(content);
    const html = marked(body);

    res.json({
      id: req.params.id,
      ...data,
      content: html
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单篇文章原始 Markdown
app.get('/api/posts/:id/raw', (req, res) => {
  try {
    const filePath = path.join(postsDir, `${req.params.id}.md`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: '文章不存在' });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content: body } = matter(fileContent);

    res.json({
      id: req.params.id,
      ...data,
      content: body.trim()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 预览 Markdown
app.post('/api/preview', (req, res) => {
  try {
    const { content } = req.body;
    const html = marked(content || '');
    res.json({ html });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新文章
app.post('/api/posts', (req, res) => {
  try {
    const { title, content, tags = [], category = '未分类' } = req.body;
    const id = uuidv4();
    const date = new Date().toISOString();
    const tagsStr = tags.map(t => `"${t}"`).join(', ');
    const fileContent = `---
title: ${title}
date: ${date}
tags: [${tagsStr}]
category: ${category}
---

${content}`;

    fs.writeFileSync(path.join(postsDir, `${id}.md`), fileContent, 'utf-8');
    res.json({ id, title, date, tags, category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新文章
app.put('/api/posts/:id', (req, res) => {
  try {
    const { title, content, tags = [], category = '未分类' } = req.body;
    const filePath = path.join(postsDir, `${req.params.id}.md`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: '文章不存在' });
    }

    const date = new Date().toISOString();
    const tagsStr = tags.map(t => `"${t}"`).join(', ');
    const fileContent = `---
title: ${title}
date: ${date}
tags: [${tagsStr}]
category: ${category}
---

${content}`;

    fs.writeFileSync(filePath, fileContent, 'utf-8');
    res.json({ id: req.params.id, title, date, tags, category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除文章
app.delete('/api/posts/:id', (req, res) => {
  try {
    const filePath = path.join(postsDir, `${req.params.id}.md`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: '文章不存在' });
    }
    fs.unlinkSync(filePath);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 上传图片
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' });
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✓ 服务器运行在 http://localhost:${PORT}`);
});
