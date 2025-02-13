import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/dateFormatter';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`*,
            categories(*),
            profiles(*)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const BUNNY_PULLZONE = 'https://gangolliassets.b-cdn.net';

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    const fileName = imageUrl.split('/').pop().split('?')[0];
    return `${BUNNY_PULLZONE}/${fileName}`;
  };

  const handleCardClick = (slug) => {
    navigate(`/post/${slug}`);
  };

  return (
    <div className="news-container">
      <h1 className="section-title">All Posts</h1>
      <div className="news-grid">
        {posts.map(post => (
          <article
            key={post.slug}
            className="news-card"
            onClick={() => handleCardClick(post.slug)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-image"
              style={{ backgroundImage: `url(${getImageUrl(post.featured_image)})` }}>
              <div className="publish-date">
                {formatDate(post.created_at)}
              </div>
            </div>
            <div className="card-content">
              <h3 className="mixed-content" lang="kn">{post.title}</h3>
              <div className="excerpt">{stripHtml(post.excerpt)}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AllPosts;
