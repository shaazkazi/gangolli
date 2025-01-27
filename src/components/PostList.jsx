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
          <div className={`featured-post ${!featuredPost._embedded?.['wp:featuredmedia']?.[0]?.source_url ? 'no-image' : ''}`} 
            style={featuredPost._embedded?.['wp:featuredmedia']?.[0]?.source_url ? 
              {backgroundImage: `url(${featuredPost._embedded['wp:featuredmedia'][0].source_url})`} : 
              undefined}>
            {!featuredPost._embedded?.['wp:featuredmedia']?.[0]?.source_url && <DefaultFeaturedImage />}
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
            <article key={post.id} className="news-card" onClick={() => handleCardClick(post.id)}>
              <div className="card-image-container">
                <img 
                  src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/default-image.png'} 
                  alt={post.title.rendered}
                  className="card-image"
                />
                <div className="publish-date">{new Date(post.date).toLocaleDateString()}</div>
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
