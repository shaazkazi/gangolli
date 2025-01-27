import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

const CategoryPage = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Fetch category details
        const categoryResponse = await axios.get(
          `http://localhost/gangolli/wp-json/wp/v2/categories/${id}`,
          { headers }
        );
        setCategory(categoryResponse.data);

        // Fetch posts for this category
        const postsResponse = await axios.get(
          `http://localhost/gangolli/wp-json/wp/v2/posts?categories=${id}&_embed`,
          { headers }
        );
        setPosts(postsResponse.data);
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
      <div className="category-hero">
        <h1>{category?.name}</h1>
        <p>{category?.description}</p>
      </div>
      <div className="news-grid">
        {posts.map(post => (
          <article key={post.id} className="news-card">
            <div className="card-image" 
              style={{backgroundImage: `url(${post._embedded?.['wp:featuredmedia']?.[0]?.source_url})`}}>
              <div className="publish-date">
                {new Date(post.date).toLocaleDateString()}
              </div>
            </div>
            <div className="card-content">
              <h3>{post.title.rendered}</h3>
              <div className="excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
