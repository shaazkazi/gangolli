import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

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
    const postChannel = supabase
      .channel('realtime:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, (payload) => {
        setPosts((prevPosts) => {
          const existingPost = prevPosts.find((post) => post.id === payload.new.id);
          return existingPost ? prevPosts : [payload.new, ...prevPosts];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []);

  useEffect(() => {
    const fetchPostsAndCategories = async () => {
      try {
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select(`
            id, title, excerpt, created_at, featured_image, category_id, slug,
            categories(id, name),
            profiles(*)
          `)
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;
        setPosts(postsData);

        // Extract unique categories
        const uniqueCategories = [
          ...new Map(postsData.map((post) => [post.categories.id, post.categories])).values(),
        ];
        setCategories(uniqueCategories);

        // Group posts by category
        const postsByCategory = {};
        postsData.forEach((post) => {
          if (!postsByCategory[post.category_id]) {
            postsByCategory[post.category_id] = [];
          }
          postsByCategory[post.category_id].push(post);
        });

        setCategoryPosts(postsByCategory);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load posts and categories');
      } finally {
        setLoading(false);
      }
    };

    fetchPostsAndCategories();
  }, []);

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const BUNNY_PULLZONE = 'https://gangolliassets.b-cdn.net'

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null
    const fileName = imageUrl.split('/').pop().split('?')[0]
    return `${BUNNY_PULLZONE}/${fileName}`
  }
  const handleCardClick = (post) => {
    navigate(`/post/${post.slug}`);
  };  

  const [featuredPost, ...regularPosts] = posts;

  if (loading) return <div className="loader"><div className="spinner"></div></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="news-container">
      {featuredPost && (
        <div className="hero-section" onClick={() => handleCardClick(featuredPost)}>
          <div className={`featured-post ${!featuredPost.featured_image ? 'no-image' : ''}`}
            style={featuredPost.featured_image ? { backgroundImage: `url(${getImageUrl(featuredPost.featured_image)})` } : undefined}>
            {!featuredPost.featured_image && <DefaultFeaturedImage />}
            <div className="featured-content">
              <h1>{featuredPost.title}</h1>
              <div className="featured-excerpt">{stripHtml(featuredPost.excerpt)}</div>
              <div className="read-more-btn">Read Full Story →</div>
            </div>
          </div>
        </div>
      )}

      <div className="latest-posts-section">
        <div className="latest-posts-header">
          <h2 className="section-title-single">Latest Posts</h2>
          <button className="see-more-btn" onClick={() => navigate('/posts')}>See More →</button>
        </div>
        <div className="news-grid">
          {regularPosts.slice(0, 6).map(post => (
            <article key={post.id} className="news-card" onClick={() => handleCardClick(post)}>
              <div className={`card-image ${!post.featured_image ? 'no-image' : ''}`}
                style={post.featured_image ? { backgroundImage: `url(${getImageUrl(post.featured_image)})` } : undefined}>
                {!post.featured_image && <DefaultPostImage />}
                <div className="publish-date">{new Date(post.created_at).toLocaleDateString()}</div>
              </div>
              <div className="card-content mixed-content">
  <h3>{post.title}</h3>
  <div className="excerpt">{stripHtml(post.excerpt)}</div>
</div>
            </article>
          ))}
        </div>
      </div>
        {categories.map(category => (
          <div key={category.id} className="category-section">
            <div className="category-header">
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
                  onClick={() => navigate(`/post/${post.slug}`)}
                >
                  <div className="card-image"
                    style={{backgroundImage: `url(${getImageUrl(post.featured_image)})`}}>
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
        ))}
      </div>
  );
};

export default PostList;
