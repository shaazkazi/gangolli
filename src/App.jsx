import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Post from './pages/Post';
import Categories from './pages/Categories';
import About from './pages/About';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import SubmitPost from './pages/SubmitPost';
import CategoryPage from './pages/CategoryPage';
import AllPosts from './pages/AllPosts'; // Create this new component
import '@fontsource/baloo-tamma-2'
import '@fontsource/poppins'


const App = () => {
  return (
    <Router>
      <div className="app-wrapper">
        <Header />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/posts" element={<AllPosts />} /> {/* Add this new route */}
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:id" element={<CategoryPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/submit" element={<SubmitPost />} />
          </Routes>
        </div>
        <ScrollToTop />
      </div>
    </Router>
  );
};

export default App;
