import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            categories(*),
            profiles(*)
          `)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  const BUNNY_PULLZONE = 'https://gangolliassets.b-cdn.net'

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null
    const fileName = imageUrl.split('/').pop().split('?')[0]
    return `${BUNNY_PULLZONE}/${fileName}`
  }
  return (
    <div className="news-container">
      <h1 className="section-title">All Posts</h1>
      <div className="news-grid">
        {posts.map(post => (
          <article key={post.id} className="news-card">
            <div className="card-image" 
              style={{backgroundImage: `url(${post.featured_image})`}}>
              <div className="publish-date">
                {new Date(post.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="card-content">
              <h3>{post.title}</h3>
              <div className="excerpt">{post.excerpt}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AllPosts;
