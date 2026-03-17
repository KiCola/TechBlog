import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-bracket">&lt;</span>
          <span className="brand-name">TechBlog</span>
          <span className="brand-bracket">/&gt;</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>首页</Link>
          <Link to="/new" className={`btn-write ${location.pathname === '/new' ? 'active' : ''}`}>
            <span className="btn-icon">✦</span> 写文章
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

