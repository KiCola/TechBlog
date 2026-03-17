import { getAllPosts, getPostBySlug } from '../../../lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import '../../../styles/post.css';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: post.cover ? { images: [post.cover] } : {},
  };
}

export default function PostPage({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="post-detail">
      <div className="post-nav">
        <Link href="/" className="back-link">← 返回首页</Link>
      </div>

      <article className="post-article">
        {/* 封面图 */}
        {post.cover && (
          <div className="post-cover">
            <img src={post.cover} alt={post.title} />
          </div>
        )}

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
