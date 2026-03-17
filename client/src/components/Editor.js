import React, { useState, useRef } from 'react';
import axios from 'axios';
import './Editor.css';

const TOOLBAR = [
  { label: 'B', title: '加粗', wrap: ['**', '**'], icon: '𝐁' },
  { label: 'I', title: '斜体', wrap: ['*', '*'], icon: '𝘐' },
  { label: 'S', title: '删除线', wrap: ['~~', '~~'], icon: 'S̶' },
  { label: '`', title: '行内代码', wrap: ['`', '`'], icon: '<>' },
  { sep: true },
  { label: 'H1', title: '一级标题', prefix: '# ' },
  { label: 'H2', title: '二级标题', prefix: '## ' },
  { label: 'H3', title: '三级标题', prefix: '### ' },
  { sep: true },
  { label: 'UL', title: '无序列表', prefix: '- ' },
  { label: 'OL', title: '有序列表', prefix: '1. ' },
  { label: 'BQ', title: '引用', prefix: '> ' },
  { sep: true },
  { label: 'CODE', title: '代码块', block: true },
  { label: 'LINK', title: '链接', special: 'link' },
];

function Editor({ content, onChange }) {
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const textareaRef = useRef(null);
  const fileRef = useRef(null);

  const getSelection = () => {
    const el = textareaRef.current;
    return {
      start: el.selectionStart,
      end: el.selectionEnd,
      text: content.substring(el.selectionStart, el.selectionEnd)
    };
  };

  const insertText = (before, after = '', replace = null) => {
    const el = textareaRef.current;
    const { start, end, text } = getSelection();
    const selected = replace !== null ? replace : text;
    const newContent =
      content.substring(0, start) +
      before + selected + after +
      content.substring(end);
    onChange(newContent);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      );
    }, 0);
  };

  const handleToolbar = (item) => {
    if (item.wrap) {
      insertText(item.wrap[0], item.wrap[1]);
    } else if (item.prefix) {
      const el = textareaRef.current;
      const start = el.selectionStart;
      const lineStart = content.lastIndexOf('\n', start - 1) + 1;
      const before = content.substring(0, lineStart);
      const after = content.substring(lineStart);
      onChange(before + item.prefix + after);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(lineStart + item.prefix.length, lineStart + item.prefix.length);
      }, 0);
    } else if (item.block) {
      insertText('\n```\n', '\n```\n', getSelection().text || '// 代码');
    } else if (item.special === 'link') {
      const { text } = getSelection();
      insertText('[', '](url)', text || '链接文字');
    }
  };

  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axios.post('/api/upload', formData);
      const imgMd = `\n![图片](http://localhost:5000${res.data.url})\n`;
      insertText(imgMd, '', '');
    } catch (err) {
      alert('图片上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        handleImageUpload(item.getAsFile());
        return;
      }
    }
  };

  const togglePreview = async () => {
    if (!preview) {
      try {
        const res = await axios.post('/api/preview', { content });
        setPreviewHtml(res.data.html);
      } catch {
        setPreviewHtml('<p>预览失败</p>');
      }
    }
    setPreview(!preview);
  };

  return (
    <div className="editor">
      <div className="editor-toolbar">
        <div className="toolbar-left">
          {TOOLBAR.map((item, i) =>
            item.sep ? (
              <span key={i} className="toolbar-sep" />
            ) : (
              <button
                key={i}
                type="button"
                title={item.title}
                className="toolbar-btn"
                onClick={() => handleToolbar(item)}
              >
                {item.icon || item.label}
              </button>
            )
          )}
          <span className="toolbar-sep" />
          <button
            type="button"
            className="toolbar-btn upload-btn"
            title="上传图片"
            onClick={() => fileRef.current.click()}
            disabled={uploading}
          >
            {uploading ? '⏳' : '🖼'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => handleImageUpload(e.target.files[0])}
          />
        </div>
        <button
          type="button"
          className={`preview-toggle ${preview ? 'active' : ''}`}
          onClick={togglePreview}
        >
          {preview ? '← 编辑' : '预览 →'}
        </button>
      </div>

      <div className="editor-body">
        {preview ? (
          <div
            className="editor-preview post-content"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            className="editor-textarea"
            value={content}
            onChange={e => onChange(e.target.value)}
            onDrop={handleDrop}
            onPaste={handlePaste}
            onDragOver={e => e.preventDefault()}
            placeholder="用 Markdown 开始写作...\n\n支持拖拽或粘贴图片上传"
            spellCheck={false}
          />
        )}
      </div>

      <div className="editor-footer">
        <span className="word-count">{content.length} 字符</span>
        <span className="drop-hint">可拖拽图片到编辑区上传</span>
      </div>
    </div>
  );
}

export default Editor;

