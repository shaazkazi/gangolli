import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <>
      <header className="main-header">
        <div className="header-container">
          <Link to="/" className="logo">
            GangolliNews
          </Link>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/about">About</Link>
            <Link to="/submit" className="submit-button">Submit Post</Link>
          </nav>
        </div>
      </header>

      <nav className="mobile-bottom-nav">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          <img src="/icons/home.svg" className="nav-icon" alt="Home" />
          <span>Home</span>
        </Link>
        <Link to="/categories" className={location.pathname === '/categories' ? 'active' : ''}>
          <img src="/icons/categories.svg" className="nav-icon" alt="Categories" />
          <span>Categories</span>
        </Link>
        <Link to="/submit" className={location.pathname === '/submit' ? 'active' : ''}>
          <img src="/icons/post.svg" className="nav-icon" alt="New Post" />
          <span>New Post</span>
        </Link>
        <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
          <img src="/icons/about.svg" className="nav-icon" alt="About" />
          <span>About</span>
        </Link>
      </nav>
    </>
  );
};

export default Header;
