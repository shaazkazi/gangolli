import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>GangolliNews</h1>
        </Link>
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/about">About</Link>
          <Link to="/submit" className="submit-button">Submit Post</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
