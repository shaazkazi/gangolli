import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; // ✅ Import HelmetProvider
import Home from './pages/Home';
import Post from './pages/Post';
import Categories from './pages/Categories';
import About from './pages/About';
import EditPost from './pages/EditPost';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import SubmitPost from './pages/SubmitPost';
import CategoryPage from './pages/CategoryPage';
import AllPosts from './pages/AllPosts';

import '@fontsource/baloo-tamma-2';
import '@fontsource/poppins';

const App = () => {
  return (
    <HelmetProvider> {/* ✅ Wrap everything inside HelmetProvider */}
      <Router>
        <div className="app-wrapper">
          <Header />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/post/:slug" element={<Post />} />
              <Route path="/posts" element={<AllPosts />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:slug" element={<CategoryPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/submit" element={<SubmitPost />} />
              <Route path="/edit-post/:slug" element={<EditPost />} />
            </Routes>
          </div>
          <ScrollToTop />
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;
