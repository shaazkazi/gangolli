import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const BUNNY_PULLZONE = 'https://gangolliassets.b-cdn.net';
const DEFAULT_AUTHOR = {
  name: 'Admin',
  role: 'Administrator',
  avatar: '/icons/icon512_maskable.png'
};

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  const fileName = imageUrl.split('/').pop().split('?')[0];
  return `${BUNNY_PULLZONE}/${fileName}`;
};

const cleanContent = (content) => {
  if (!content) return '';
  return content
    .replace(/<p><br><\/p>/g, '')
    .replace(/(<br\s*\/?>){2,}/g, '<br/>')
    .replace(/\s+/g, ' ')
    .trim();
};

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error: postError } = await supabase
          .from('posts')
          .select(`
            *,
            categories(*),
            profiles(*)
          `)
          .eq('id', id)
          .single();

        if (postError) throw postError;
        setPost(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post. Please try again later.');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="loader"><div className="spinner"></div></div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div className="not-found">Post not found.</div>;

  return (
    <div className="post-detail">
      {post.featured_image && (
        <div
          className="post-hero"
          style={{ backgroundImage: `url(${getImageUrl(post.featured_image)})` }}
        >
          <div className="post-hero-overlay"></div>
        </div>
      )}
      <div className="post-content">
        <div className="post-meta">
          <span className="post-category">{post.categories?.name}</span>
          <span className="post-date">
            {new Date(post.created_at).toLocaleDateString()}
          </span>
          <div className="author-info">
            <img
              src={post.profiles?.avatar_url || DEFAULT_AUTHOR.avatar}
              alt={post.profiles?.name || DEFAULT_AUTHOR.name}
              className="author-avatar"
            />
            <span className="author-name">
              By {post.profiles?.name || DEFAULT_AUTHOR.name}
            </span>
          </div>
        </div>
        <h1 className="mixed-content">{post.title}</h1>
        <div 
          className="post-body mixed-content" 
          dangerouslySetInnerHTML={{ __html: cleanContent(post.content) }} 
        />
      </div>
    </div>
  );
};

export default PostDetail;
