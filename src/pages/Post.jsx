import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [readingTime, setReadingTime] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const calculateReadingTime = useCallback((content) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await axios.get(
          `http://localhost/gangolli/wp-json/wp/v2/posts/${id}?_embed`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setPost(response.data);
        
        if (response.data.categories?.length) {
          const relatedResponse = await axios.get(
            `http://localhost/gangolli/wp-json/wp/v2/posts?categories=${response.data.categories[0]}&exclude=${id}&per_page=3&_embed`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          setRelatedPosts(relatedResponse.data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (post?.content?.rendered) {
      setReadingTime(calculateReadingTime(post.content.rendered));
    }
  }, [post, calculateReadingTime]);

  // Separate useEffect for scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  if (loading) return <div className="loader"><div className="spinner"></div></div>;
  if (!post) return <div className="error-message">Post not found</div>;

  const handleShare = async () => {
    // Clean excerpt text by removing HTML tags and limiting length
    const cleanExcerpt = post.excerpt.rendered
      .replace(/<[^>]*>/g, '')
      .slice(0, 140) + '...';

    // Create SEO-friendly share data
    const shareData = {
      title: `${post.title.rendered} | GangolliNews`,
      text: cleanExcerpt,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(
        `${shareData.title}\n\n${shareData.text}\n\nRead more at: ${shareData.url}`
      );
      const shareButton = document.querySelector('.share-button');
      shareButton.textContent = 'Link Copied!';
      setTimeout(() => {
        shareButton.textContent = 'Share';
      }, 2000);
    }
  };

  return (
    <div className="post-page">
      <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />
      <Header />
      <article className="single-post">
        {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
          <div 
            className="post-hero" 
            style={{ backgroundImage: `url(${post._embedded['wp:featuredmedia'][0].source_url})` }}
          >
            <div className="post-hero-overlay"></div>
          </div>
        )}
        <div className="post-container">
          {post._embedded?.['wp:term']?.[0]?.[0]?.name && (
            <div className="post-category">{post._embedded['wp:term'][0][0].name}</div>
          )}
          <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }}></h1>
          <div className="post-meta">
            <span className="post-date">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="reading-time">{readingTime} min read</span>
            <span className="post-author">
              By {post._embedded?.author?.[0]?.name}
            </span>
            <button onClick={handleShare} className="share-button">Share</button>
          </div>
          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
                      {relatedPosts.length > 0 && (
                        <div className="related-posts">
                          <h2>Related Stories</h2>
                          <div className="related-posts-grid">
                            {relatedPosts.map(relatedPost => (
                              <Link 
                                to={`/post/${relatedPost.id}`} 
                                key={relatedPost.id}
                                className="related-post-card"
                              >
                                <div 
                                  className="related-post-image"
                                  style={{
                                    backgroundImage: `url(${relatedPost._embedded['wp:featuredmedia']?.[0]?.source_url})`
                                  }}
                                >
                                  <div className="post-meta-info">
                                    {new Date(relatedPost.date).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </div>
                                </div>
                                <h3 dangerouslySetInnerHTML={{ __html: relatedPost.title.rendered }}></h3>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
      </article>
    </div>
  );
};

export default Post;