'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import '../styles/navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <span className="brand-bracket">&lt;</span>
          <span className="brand-name">TechBlog</span>
          <span className="brand-bracket">/&gt;</span>
        </Link>
        <div className="navbar-links">
          <Link href="/">首页</Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-github"
          >
            ⭐ GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
