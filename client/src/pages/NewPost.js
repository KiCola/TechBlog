import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Editor from '../components/Editor';
import './PostForm.css';

function NewPost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('请输入标题');
    if (!content.trim()) return alert('请输入内容');
    setSaving(true);
    try {
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
      const res = await axios.post('/api/posts', {
        title,
        content,
        category: category || '未分类',
        tags: tagList
      });
      navigate(`/post/${res.data.id}`);
    } catch (err) {
      alert('发布失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="post-form-page">
      <div className="form-header">
        <h1>✦ 写新文章</h1>
        <p>用 Markdown 记录你的技术心得</p>
      </div>
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-row">
          <div className="form-group flex-2">
            <label>文章标题 <span className="required">*</span></label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="输入一个吸引人的标题..."
              className="form-input"
            />
          </div>
          <div className="form-group flex-1">
            <label>分类</label>
            <input
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="如：前端、算法"
              className="form-input"
            />
          </div>
          <div className="form-group flex-1">
            <label>标签 <span className="hint">（逗号分隔）</span></label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="React, JavaScript"
              className="form-input"
            />
          </div>
        </div>
        <Editor content={content} onChange={setContent} />
        <div className="form-footer">
          <button type="button" onClick={() => navigate('/')} className="btn-cancel">取消</button>
          <button type="submit" disabled={saving} className="btn-submit">
            {saving ? '发布中...' : '发布文章'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewPost;

