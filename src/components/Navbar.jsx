import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-white text-xl font-bold">GangolliNews</Link>
        <div className="space-x-4">
          <Link to="/" className="text-white">Home</Link>
          <Link to="/categories" className="text-white">Categories</Link>
          <Link to="/about" className="text-white">About</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
