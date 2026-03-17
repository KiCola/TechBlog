import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import NewPost from './pages/NewPost';
import EditPost from './pages/EditPost';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/new" element={<NewPost />} />
            <Route path="/edit/:id" element={<EditPost />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>© {new Date().getFullYear()} 我的技术博客 · 用代码记录思考</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

