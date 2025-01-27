import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const response = await axios.get(
          'http://localhost/gangolli/wp-json/wp/v2/categories',
          { headers }
        );
        setCategories(response.data);
        
        const postsData = {};
        for (const category of response.data) {
          const postsResponse = await axios.get(
            `http://localhost/gangolli/wp-json/wp/v2/posts?categories=${category.id}&per_page=4&_embed`,
            { headers }
          );
          postsData[category.id] = postsResponse.data;
        }
        setPosts(postsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  if (loading) return <div className="loader"><div className="spinner"></div></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="categories-page">
      <Header />
      <div className="categories-hero">
        <h1>News Categories</h1>
        <p>Explore news by your favorite topics</p>
      </div>
      
      <div className="categories-container">
        {categories.map((category) => (
          <div key={category.id} className="category-section">
            <div className="category-header">
              <h2>{category.name}</h2>
              {category.description && 
                <p className="category-description">{category.description}</p>
              }
            </div>
            
            <div className="category-posts-grid">
              {posts[category.id]?.map((post) => (
                <Link 
                  to={`/post/${post.id}`}
                  key={post.id} 
                  className="category-post-card"
                >
                  <div 
                    className="post-image"
                    style={{
                      backgroundImage: `url(${post._embedded?.['wp:featuredmedia']?.[0]?.source_url})`
                    }}
                  >
                    <div className="post-overlay">
                      <span className="post-date">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="post-content">
                    <h3 dangerouslySetInnerHTML={{ __html: post.title.rendered }}></h3>
                    <div 
                      className="post-excerpt"
                      dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
