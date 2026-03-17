import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './PostDetail.css';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`/api/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('确定要删除这篇文章吗？')) return;
    try {
      await axios.delete(`/api/posts/${id}`);
      navigate('/');
    } catch (err) {
      alert('删除失败');
    }
  };

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

  if (!post) return (
    <div className="not-found">
      <h2>文章不存在</h2>
      <Link to="/">返回首页</Link>
    </div>
  );

  return (
    <div className="post-detail">
      <div className="post-nav">
        <Link to="/" className="back-link">← 返回首页</Link>
        <div className="post-actions">
          <Link to={`/edit/${id}`} className="btn-edit">编辑</Link>
          <button onClick={handleDelete} className="btn-delete">删除</button>
        </div>
      </div>

      <article className="post-article">
        <header className="post-header">
          <div className="post-meta">
            <span className="post-category">{post.category || '未分类'}</span>
            <span className="post-date">{formatDate(post.date)}</span>
          </div>
          <h1 className="post-title">{post.title}</h1>
          {post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.map(tag => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
          )}
        </header>

        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}

export default PostDetail;

