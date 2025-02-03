import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'
import Header from '../components/Header';

export default function Post() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [readingTime, setReadingTime] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  const createGalleryView = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const images = doc.getElementsByTagName('img');
    
    if (images.length > 1) {
      return (
        <div className="post-gallery">
          {Array.from(images).map((img, index) => (
            <div key={index} className="gallery-item" onClick={() => setSelectedImage(img.src)}>
              <img src={img.src} alt={img.alt || 'Gallery image'} />
            </div>
          ))}
        </div>
      );
    }
    return content;
  };

  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  useEffect(() => {
    async function getPost() {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories (*),
          profiles (*)
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error:', error)
        setLoading(false)
        return
      }

      setPost(data)
      setLoading(false)

      if (data.content) {
        setReadingTime(calculateReadingTime(data.content));
      }
    }

    getPost()
    window.scrollTo(0, 0);
  }, [id])

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return <div className="loader"><div className="spinner"></div></div>;
  if (!post) return <div className="error-message">Post not found</div>;

  const handleShare = async () => {
    const cleanExcerpt = post.excerpt
      .replace(/<[^>]*>/g, '')
      .slice(0, 140) + '...';

    const shareData = {
      title: `${post.title} | GangolliNews`,
      text: cleanExcerpt,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(
        `${shareData.title}\n\n${shareData.text}\n\nRead more at: ${shareData.url}`
      );
      const shareButton = document.querySelector('.share-button');
      shareButton.textContent = 'Link Copied!';
      setTimeout(() => {
        shareButton.textContent = 'Share';
      }, 2000);
    }
  };

  return (
    <div className="post-page">
      <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />
      <Header />
      <article className="single-post">
        {post.featured_image && (
          <div 
            className="post-hero" 
            style={{ backgroundImage: `url(${post.featured_image})` }}
          >
            <div className="post-hero-overlay"></div>
          </div>
        )}
        <div className="post-container">
          {post.categories?.name && (
            <div className="post-category">{post.categories.name}</div>
          )}
          <h1 dangerouslySetInnerHTML={{ __html: post.title }}></h1>
          <div className="post-meta">
            <span className="post-date">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="reading-time">{readingTime} min read</span>
            <span className="post-author">
              By {post.profiles?.name}
            </span>
            <button onClick={handleShare} className="share-button">Share</button>
          </div>
          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
          {selectedImage && (
            <div className="image-modal" onClick={() => setSelectedImage(null)}>
              <button className="close-button">×</button>
              <img src={selectedImage} alt="Preview" />
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
