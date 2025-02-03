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

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData);
        
        const postsData = {};
        for (const category of categoriesData) {
          const { data: categoryPostsData } = await supabase
            .from('posts')
            .select(`
              *,
              categories(*),
              profiles(*)
            `)
            .eq('category_id', category.id)
            .order('created_at', { ascending: false })
            .limit(4);

          postsData[category.id] = categoryPostsData;
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
                    <div className="post-excerpt">{post.excerpt}</div>
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
