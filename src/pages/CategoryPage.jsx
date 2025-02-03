import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import Header from '../components/Header';

const BUNNY_PULLZONE = 'https://gangolliassets.b-cdn.net'

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null
  const fileName = imageUrl.split('/').pop().split('?')[0]
  return `${BUNNY_PULLZONE}/${fileName}`
}

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      try {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single();

        if (categoryData) {
          setCategory(categoryData);

          const { data: postsData } = await supabase
            .from('posts')
            .select(`
              *,
              categories(*),
              profiles(*)
            `)
            .eq('category_id', categoryData.id)
            .order('created_at', { ascending: false });

          setPosts(postsData || []);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [slug]);

  const handlePostClick = (post) => {
    navigate(`/post/${post.slug}`);
  };

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div className="category-page">
      <Header />
      <div className="category-hero">
        <div className="category-hero-content">
          <span className="category-label">Category</span>
          <h1>{category?.name}</h1>
          {category?.description && <p>{category?.description}</p>}
          <div className="category-meta">
            <span>{posts.length} Stories</span>
          </div>
        </div>
      </div>
      <div className="news-grid">
        {posts.map(post => (
          <article 
            key={post.id} 
            className="news-card"
            onClick={() => handlePostClick(post)}
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
  );
};

export default CategoryPage;
