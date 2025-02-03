import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'
import Header from '../components/Header'

const BUNNY_PULLZONE = 'https://gangolliassets.b-cdn.net'
const DEFAULT_AUTHOR = {
  name: 'Admin',
  role: 'Administrator',
  avatar: '/icons/icon512_maskable.png'
}

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null
  const fileName = imageUrl.split('/').pop().split('?')[0]
  return `${BUNNY_PULLZONE}/${fileName}`
}

export default function Post() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [readingTime, setReadingTime] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [selectedImage, setSelectedImage] = useState(null)
  const [session, setSession] = useState(null)

  const createGalleryView = (content) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const images = doc.getElementsByTagName('img')
    
    if (images.length > 1) {
      return (
        <div className="post-gallery">
          {Array.from(images).map((img, index) => (
            <div key={index} className="gallery-item" onClick={() => setSelectedImage(img.src)}>
              <img src={img.src} alt={img.alt || 'Gallery image'} />
            </div>
          ))}
        </div>
      )
    }
    return content
  }

  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  useEffect(() => {
    async function getPost() {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories (*),
          profiles (*)
        `)
        .eq('slug', slug)
        .single()

      if (error) {
        console.error('Error:', error)
        setLoading(false)
        return
      }

      setPost(data)

      // Fetch related posts
      if (data) {
        const { data: relatedData } = await supabase
          .from('posts')
          .select(`
            *,
            categories (*),
            profiles (*)
          `)
          .eq('category_id', data.category_id)
          .neq('slug', slug)
          .limit(3)
          .order('created_at', { ascending: false })

        setRelatedPosts(relatedData || [])
      }

      setLoading(false)

      if (data.content) {
        setReadingTime(calculateReadingTime(data.content))
      }
    }

    getPost()
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrolled / maxHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleShare = async () => {
    const cleanExcerpt = post.excerpt
      .replace(/<[^>]*>/g, '')
      .slice(0, 140) + '...'

    const shareData = {
      title: `${post.title} | GangolliNews`,
      text: cleanExcerpt,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(
        `${shareData.title}\n\n${shareData.text}\n\nRead more at: ${shareData.url}`
      )
      const shareButton = document.querySelector('.share-button')
      shareButton.textContent = 'Link Copied!'
      setTimeout(() => {
        shareButton.textContent = 'Share'
      }, 2000)
    }
  }

  const handleEdit = () => {
    if (session) {
      navigate(`/submit?edit=${post.slug}`)
    }
  }

  const deletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('slug', post.slug)
      
      if (!error) {
        navigate('/')
      }
    }
  }

  if (loading) return <div className="loader"><div className="spinner"></div></div>
  if (!post) return <div className="error-message">Post not found</div>

  return (
    <div className="post-page">
      <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />
      <Header />
      <article className="single-post">
        {post.featured_image && (
          <div
            className="post-hero"
            style={{ backgroundImage: `url(${getImageUrl(post.featured_image)})` }}
          >
            <div className="post-hero-overlay"></div>
          </div>
        )}
        <div className="post-container">
          {post.categories?.name && (
            <div className="post-category">{post.categories.name}</div>
          )}
          <h1 className="mixed-content" dangerouslySetInnerHTML={{ __html: post.title }}></h1>
          <div className="post-meta">
            <span className="post-date">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="reading-time">{readingTime} min read</span>
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
            <button onClick={handleShare} className="share-button">Share</button>
          </div>
          <div className="post-content mixed-content" dangerouslySetInnerHTML={{ __html: post.content }} />
          {selectedImage && (
            <div className="image-modal" onClick={() => setSelectedImage(null)}>
              <button className="close-button">×</button>
              <img src={selectedImage} alt="Preview" />
            </div>
          )}
          
          {relatedPosts.length > 0 && (
            <div className="related-posts">
              <h2>Related Stories</h2>
              <div className="related-posts-grid">
                {relatedPosts.map(post => (
                  <article
                    key={post.id}
                    className="related-post-card"
                    onClick={() => navigate(`/post/${post.slug}`)}
                  >
                    <div
                      className="related-post-image"
                      style={{backgroundImage: `url(${getImageUrl(post.featured_image)})`}}
                    >
                      <div className="post-overlay"></div>
                    </div>
                    <div className="related-post-content">
                      <h3>{post.title}</h3>
                      <span className="post-date">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {session && (
        <div className="fab-container">
          <div className="fab-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            <div className="fab-menu">
              <button onClick={handleEdit} className="fab-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Edit
              </button>
              <button onClick={deletePost} className="fab-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}