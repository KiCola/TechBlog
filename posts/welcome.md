---
title: 欢迎来到我的技术博客
date: 2026-03-17T00:00:00.000Z
tags: ["博客", "介绍"]
category: 随笔
---

## 你好，世界！👋

欢迎来到这个技术博客。这里将记录我在学习和工作中积累的技术心得、踩过的坑以及一些有趣的发现。

## 这个博客能做什么？

- **Markdown 写作**：完整支持 GFM（GitHub Flavored Markdown）语法
- **代码高亮**：支持多种编程语言的语法展示
- **图片上传**：拖拽或粘贴图片即可上传
- **分类管理**：通过分类和标签组织文章
- **实时预览**：编辑时随时切换预览模式

## 代码示例

```javascript
// 一个简单的 React Hook 示例
import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

## Markdown 语法速查

| 语法 | 效果 |
|------|------|
| `**加粗**` | **加粗** |
| `*斜体*` | *斜体* |
| `` `代码` `` | `代码` |
| `> 引用` | 引用块 |

> 好记性不如烂笔头。用文字记录下来的知识，才真正属于自己。

现在就去写下你的第一篇技术文章吧！

