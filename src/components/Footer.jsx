import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>GangolliNews</h3>
          <p>Your trusted source for local news and updates from the Gangolli region.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/categories">Local News</Link></li>
            <li><Link to="/categories">Business</Link></li>
            <li><Link to="/categories">Culture</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Connect With Us</h4>
          <div className="social-links">
            <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2025 GangolliNews. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
