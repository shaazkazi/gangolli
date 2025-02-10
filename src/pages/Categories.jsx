import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import Header from '../components/Header';

const BUNNY_PULLZONE = 'https://gangolliassets.b-cdn.net'

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null
  const fileName = imageUrl.split('/').pop().split('?')[0]
  return `${BUNNY_PULLZONE}/${fileName}`
}

const cleanExcerpt = (html) => {
  if (!html) return '';
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&zwnj;/g, '')
    .replace(/<[^>]+style="[^"]*"[^>]*>/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      setCategories(data || []);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length) {
      const fetchPostsForCategories = async () => {
        const promises = categories.map(category => 
          supabase
            .from('posts')
            .select(`*, categories(*), profiles(*)`)
            .eq('category_id', category.id)
            .order('created_at', { ascending: false })
            .limit(4)
        );

        const results = await Promise.all(promises);
        const postsData = {};
        results.forEach((result, index) => {
          postsData[categories[index].id] = result.data;
        });
        setPosts(postsData);
      };

      fetchPostsForCategories();
    }
  }, [categories]);

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

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
                  to={`/post/${post.slug}`}
                  key={post.id} 
                  className="category-post-card"
                >
                  <div 
                    className="post-image"
                    style={{
                      backgroundImage: `url(${getImageUrl(post.featured_image)})`
                    }}
                  >
                    <div className="post-overlay">
                      <span className="post-date">
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="post-content">
                    <h3>{post.title}</h3>
                    <div className="post-excerpt">{cleanExcerpt(post.excerpt)}</div>
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
