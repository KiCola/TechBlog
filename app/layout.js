import '../styles/globals.css';
import '../styles/app.css';
import 'katex/dist/katex.min.css';
import Navbar from '../components/Navbar';

const basePath = process.env.NODE_ENV === 'production' ? '/TechBlog' : '';

export const metadata = {
  title: {
    default: '技术博客',
    template: '%s | 技术博客',
  },
  description: '记录学习与探索，用文字沉淀技术',
};

export default function RootLayout({ children }) {
  const bgStyle = `
    body {
      background-image:
        linear-gradient(rgba(13, 17, 23, 0.82), rgba(13, 17, 23, 0.2)),
        url('${basePath}/wallhaven-e8996r.jpg');
    }
  `;

  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: bgStyle }} />
      </head>
      <body>
        <div className="app">
          <Navbar />
          <main className="main-content">
            {children}
          </main>
          <footer className="footer">
            <p>© {new Date().getFullYear()} 我的技术博客 · 用代码记录思考</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
