import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import Header from '../components/Header';

const BUNNY_PULLZONE = 'https://gangolliassets.b-cdn.net'

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null
  const fileName = imageUrl.split('/').pop().split('?')[0]
  return `${BUNNY_PULLZONE}/${fileName}`
}

const CategoryPage = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      try {
        // Fetch category details
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .eq('id', id)
          .single();

        if (categoryError) throw categoryError;
        setCategory(categoryData);

        // Fetch posts for this category
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select(`
            *,
            categories(*),
            profiles(*)
          `)
          .eq('category_id', id)
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;
        setPosts(postsData);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [id]);

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div className="category-page">
      <Header />
      <div className="category-hero">
        <h1>{category?.name}</h1>
        <p>{category?.description}</p>
      </div>
      <div className="news-grid">
        {posts.map(post => (
          <article key={post.id} className="news-card">
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
