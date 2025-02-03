import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ session, onEdit, onDelete }) => {
  const location = useLocation();
  const isPostPage = location.pathname.includes('/post/');

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">GangolliNews</Link>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="text-white">Home</Link>
          <Link to="/categories" className="text-white">Categories</Link>
          <Link to="/about" className="text-white">About</Link>
          {isPostPage && session && (
            <div className="admin-controls ml-4 flex gap-2">
              <button onClick={onEdit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Edit
              </button>
              <button onClick={onDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
