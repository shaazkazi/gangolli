import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Post from './pages/Post';
import Categories from './pages/Categories';
import About from './pages/About';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SubmitPost from './pages/SubmitPost';

const App = () => {
  return (
    <Router>
      <div className="app-wrapper">
        <div className="progress-bar" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />
          <Route path="/submit" element={<SubmitPost />} />
        </Routes>
        <ScrollToTop />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
