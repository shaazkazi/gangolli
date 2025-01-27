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
          <svg className="nav-icon" viewBox="0 0 24 24">
            <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/>
          </svg>
          <span>Home</span>
        </Link>
        <Link to="/categories" className={location.pathname === '/categories' ? 'active' : ''}>
          <svg className="nav-icon" viewBox="0 0 24 24">
            <path d="M4 4h4v4H4zm6 0h10v4H10zm-6 6h4v4H4zm6 0h10v4H10zm-6 6h4v4H4zm6 0h10v4H10z"/>
          </svg>
          <span>Categories</span>
        </Link>
        <Link to="/submit" className={location.pathname === '/submit' ? 'active' : ''}>
          <svg className="nav-icon" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          <span>New Post</span>
        </Link>
        <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
          <svg className="nav-icon" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          <span>About</span>
        </Link>
      </nav>
    </>
  );
};

export default Header;
