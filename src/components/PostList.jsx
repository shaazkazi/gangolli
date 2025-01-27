import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await axios.get(
          `http://localhost/gangolli/wp-json/wp/v2/posts?page=${page}&per_page=7&_embed`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setPosts(response.data);
        setTotalPages(Number(response.headers['x-wp-totalpages']));
        setLoading(false);
      } catch (error) {
        setError('Failed to load posts');
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page]);
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
          <div className="featured-post" style={{backgroundImage: `url(${featuredPost._embedded?.['wp:featuredmedia']?.[0]?.source_url})`}}>
            <div className="featured-content">
              <div className="category-tag">Featured</div>
              <h1>{featuredPost.title.rendered}</h1>
              <div className="featured-meta">
                <span className="featured-date">
                  {new Date(featuredPost.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="featured-author">
                  {featuredPost._embedded?.author?.[0]?.name}
                </span>
              </div>
              <div className="featured-excerpt" dangerouslySetInnerHTML={{ __html: featuredPost.excerpt.rendered }} />
              <div className="read-more-btn">Read Full Story →</div>
            </div>
          </div>
        </div>
      )}

      <div className="trending-section">
        <h2 className="section-title">Latest News</h2>
        <div className="news-grid">
          {regularPosts.map((post) => (
            <article 
              key={post.id} 
              className="news-card" 
              onClick={() => handleCardClick(post.id)}
            >
              <div className="card-image" style={{backgroundImage: `url(${post._embedded?.['wp:featuredmedia']?.[0]?.source_url})`}}>
                <div className="publish-date">{new Date(post.date).toLocaleDateString()}</div>
                <div className="card-overlay"></div>
              </div>
              <div className="card-content">
                <h3>{post.title.rendered}</h3>
                <div className="excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                <div className="card-meta">
                  <span className="read-time">5 min read</span>
                  <span className="read-more">Continue Reading →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          ← Previous
        </button>
        <span className="page-info">Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
          Next →
        </button>
      </div>
    </div>
  );
};

export default PostList;
