'use client';

import { useState } from 'react';
import Link from 'next/link';
import '../styles/home.css';

export default function HomeClient({ posts }) {
  const [filter, setFilter] = useState('全部');
  const allCategories = ['全部', ...new Set(posts.map(p => p.category || '未分类'))];
  const filtered = filter === '全部' ? posts : posts.filter(p => p.category === filter);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // 无封面时，根据分类生成渐变色占位背景
  const getCoverGradient = (category) => {
    const gradients = {
      '前端开发': 'linear-gradient(135deg, #1a1f35 0%, #0f3460 100%)',
      '后端开发': 'linear-gradient(135deg, #1a2f1a 0%, #0f4020 100%)',
      '算法': 'linear-gradient(135deg, #2f1a2f 0%, #4a0f5a 100%)',
      '技术教程': 'linear-gradient(135deg, #2a1f10 0%, #5a3a0f 100%)',
      '随笔': 'linear-gradient(135deg, #1a1a2f 0%, #0f205a 100%)',
    };
    return gradients[category] || 'linear-gradient(135deg, #161b22 0%, #1c2f3a 100%)';
  };

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-tag">// my tech blog</div>
        <h1 className="hero-title">记录 · 学习 · 成长</h1>
        <p className="hero-sub">用文字沉淀技术，用代码丈量世界</p>
        <div className="hero-stats">
          <span><strong>{posts.length}</strong> 篇文章</span>
          <span className="divider">·</span>
          <span><strong>{allCategories.length - 1}</strong> 个分类</span>
        </div>
      </div>

      {allCategories.length > 2 && (
        <div className="category-filter">
          {allCategories.map(cat => (
            <button
              key={cat}
              className={`cat-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>还没有文章</h3>
          <p>快去 posts/ 目录下创建你的第一篇 Markdown 文章吧</p>
        </div>
      ) : (
        <div className="posts-grid">
          {filtered.map((post, i) => (
            <article
              key={post.slug}
              className="post-card"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* 封面图区域 */}
              <Link href={`/posts/${post.slug}`} className="card-cover-link">
                <div
                  className="card-cover"
                  style={post.cover
                    ? { backgroundImage: `url(${post.cover})` }
                    : { background: getCoverGradient(post.category) }
                  }
                >
                  {!post.cover && (
                    <div className="card-cover-placeholder">
                      <span className="cover-category-text">{post.category || '未分类'}</span>
                      <span className="cover-title-text">{post.title}</span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="card-body">
                <div className="card-header">
                  <span className="card-category">{post.category || '未分类'}</span>
                  <span className="card-date">{formatDate(post.date)}</span>
                </div>
                <h2 className="card-title">
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="card-excerpt">{post.excerpt}...</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="card-tags">
                    {post.tags.map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                )}
                <div className="card-footer">
                  <Link href={`/posts/${post.slug}`} className="read-more">
                    阅读全文 →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
