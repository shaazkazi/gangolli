import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost/gangolli/wp-json/wp/v2/posts/${id}`)
      .then((response) => {
        setPost(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching post:', error);
        setError('Failed to load post. Please try again later.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container">{error}</div>;
  if (!post) return <div className="container">Post not found.</div>;

  return (
    <div className="container">
      <div className="post-detail">
        <h1>{post.title.rendered}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      </div>
    </div>
  );
};

export default PostDetail;