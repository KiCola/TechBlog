import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Editor from '../components/Editor';
import './PostForm.css';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`/api/posts/${id}`);
      // 获取原始markdown内容
      const raw = await axios.get(`/api/posts/${id}/raw`);
      setTitle(res.data.title || '');
      setContent(raw.data.content || '');
      setCategory(res.data.category || '');
      setTags((res.data.tags || []).join(', '));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('请输入标题');
    setSaving(true);
    try {
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
      await axios.put(`/api/posts/${id}`, {
        title,
        content,
        category: category || '未分类',
        tags: tagList
      });
      navigate(`/post/${id}`);
    } catch (err) {
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <p>加载中...</p>
    </div>
  );

  return (
    <div className="post-form-page">
      <div className="form-header">
        <h1>✎ 编辑文章</h1>
        <p>修改并更新你的文章内容</p>
      </div>
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-row">
          <div className="form-group flex-2">
            <label>文章标题 <span className="required">*</span></label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="输入标题..."
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
          <button type="button" onClick={() => navigate(`/post/${id}`)} className="btn-cancel">取消</button>
          <button type="submit" disabled={saving} className="btn-submit">
            {saving ? '保存中...' : '保存更新'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPost;

