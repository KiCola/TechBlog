import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('全部');
  const [categories, setCategories] = useState(['全部']);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/posts');
      setPosts(res.data);
      const cats = ['全部', ...new Set(res.data.map(p => p.category || '未分类'))];
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === '全部' ? posts : posts.filter(p => p.category === filter);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <p>加载中...</p>
    </div>
  );

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-tag">// my tech blog</div>
        <h1 className="hero-title">记录 · 学习 · 成长</h1>
        <p className="hero-sub">用文字沉淀技术，用代码丈量世界</p>
        <div className="hero-stats">
          <span><strong>{posts.length}</strong> 篇文章</span>
          <span className="divider">·</span>
          <span><strong>{categories.length - 1}</strong> 个分类</span>
        </div>
      </div>

      {categories.length > 2 && (
        <div className="category-filter">
          {categories.map(cat => (
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
          <p>开始写下你的第一篇技术博客吧</p>
          <Link to="/new" className="btn-primary">写第一篇文章</Link>
        </div>
      ) : (
        <div className="posts-grid">
          {filtered.map((post, i) => (
            <article key={post.id} className="post-card" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="card-header">
                <span className="card-category">{post.category || '未分类'}</span>
                <span className="card-date">{formatDate(post.date)}</span>
              </div>
              <h2 className="card-title">
                <Link to={`/post/${post.id}`}>{post.title}</Link>
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
                <Link to={`/post/${post.id}`} className="read-more">阅读全文 →</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;

