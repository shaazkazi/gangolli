import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DefaultPostImage = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--text-secondary)">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
  </svg>
);

const DefaultFeaturedImage = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="var(--text-secondary)">
    <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
  </svg>
);

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryPosts, setCategoryPosts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await axios.get(
          `http://localhost/gangolli/wp-json/wp/v2/posts?per_page=7&_embed`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load posts');
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await axios.get('http://localhost/gangolli/wp-json/wp/v2/categories', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setCategories(response.data);
      
        const postsData = {};
        for (const category of response.data) {
          const postsResponse = await axios.get(
            `http://localhost/gangolli/wp-json/wp/v2/posts?categories=${category.id}&per_page=5&_embed`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          postsData[category.id] = postsResponse.data;
        }
        setCategoryPosts(postsData);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleCardClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const [featuredPost, ...regularPosts] = posts;

  if (loading) return <div className="loader"><div className="spinner"></div></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="news-container">
      {featuredPost && (
        <div className="hero-section" onClick={() => handleCardClick(featuredPost.id)}>
          <div className={`featured-post ${!featuredPost._embedded?.['wp:featuredmedia']?.[0]?.source_url ? 'no-image' : ''}`} 
            style={featuredPost._embedded?.['wp:featuredmedia']?.[0]?.source_url ? 
              {backgroundImage: `url(${featuredPost._embedded['wp:featuredmedia'][0].source_url})`} : 
              undefined}>
            {!featuredPost._embedded?.['wp:featuredmedia']?.[0]?.source_url && <DefaultFeaturedImage />}
            <div className="featured-content">
              <div className="category-tag">
                <svg className="featured-icon" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M17.09 4.56c-.7-1.03-1.6-1.9-2.63-2.56-.91 1.22-2.04 2.27-3.32 3.13-3.21 2.14-7.28 2.43-10.73.83 2.05 4.5 2.72 8.29 2.72 12.29 0 .68.02 1.36.06 2.04.43.24.88.46 1.34.65C8.47 19.43 12 16.97 12 16.97s3.53 2.46 7.48 3.97c.46-.19.91-.41 1.34-.65.04-.68.06-1.36.06-2.04 0-4-.67-7.79-2.72-12.29-.37-.8-.76-1.56-1.07-1.4z"/>
                </svg>
                Trending
              </div>
              <h1>{featuredPost.title.rendered}</h1>
              <div className="featured-excerpt" dangerouslySetInnerHTML={{ __html: featuredPost.excerpt.rendered }} />
              <div className="read-more-btn">Read Full Story →</div>
            </div>
          </div>
        </div>
      )}

      <div className="latest-posts-section">
        <div className="latest-posts-header">
          <h2 className="section-title-single">Latest Posts</h2>
          <button className="see-more-btn" onClick={() => navigate('/posts')}>
            See More →
          </button>
        </div>
        <div className="news-grid">
          {regularPosts.slice(0, 6).map(post => (
            <article 
              key={post.id} 
              className="news-card" 
              onClick={() => handleCardClick(post.id)}
            >
              <div className={`card-image ${!post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? 'no-image' : ''}`}
                style={post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? 
                  {backgroundImage: `url(${post._embedded['wp:featuredmedia'][0].source_url})`} : 
                  undefined}>
                {!post._embedded?.['wp:featuredmedia']?.[0]?.source_url && <DefaultPostImage />}
                <div className="publish-date">{new Date(post.date).toLocaleDateString()}</div>
                <div className="card-overlay"></div>
              </div>
              <div className="card-content">
                <h3>{post.title.rendered}</h3>
                <div className="excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                <div className="card-meta">
                  <span className="read-more">Continue Reading →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {categories.map(category => (
        <div key={category.id} className="category-section">
          <div className="latest-posts-header">
            <h2 className="section-title-single">{category.name}</h2>
            <button className="see-more-btn" onClick={() => navigate(`/categories/${category.id}`)}>
              See More →
            </button>
          </div>
          <div className="news-grid">
            {categoryPosts[category.id]?.map(post => (
              <article 
                key={post.id} 
                className="news-card" 
                onClick={() => handleCardClick(post.id)}
              >
                <div className={`card-image ${!post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? 'no-image' : ''}`}
                  style={post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? 
                    {backgroundImage: `url(${post._embedded['wp:featuredmedia'][0].source_url})`} : 
                    undefined}>
                  {!post._embedded?.['wp:featuredmedia']?.[0]?.source_url && <DefaultPostImage />}
                  <div className="publish-date">{new Date(post.date).toLocaleDateString()}</div>
                  <div className="card-overlay"></div>
                </div>
                <div className="card-content">
                  <h3>{post.title.rendered}</h3>
                  <div className="excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                  <div className="card-meta">
                    <span className="read-more">Continue Reading →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
