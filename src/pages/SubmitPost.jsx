import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { uploadImage } from '../utils/imageUpload';

const SubmitPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null);
  const [categories, setCategories] = useState([]);
  const [slug, setSlug] = useState('');
  const quillRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      setCategories(data || []);
    };
    
    fetchCategories();
  }, []);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image'],
      ['clean']
    ]
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) throw error;
    } catch (error) {
      console.error('Authentication failed:', error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title,
            content,
            category_id: category,
            featured_image: imageUrl,
            author_id: session.user.id,
            excerpt: content.substring(0, 200),
            slug: slug || generateSlug(title)
          }
        ])
        .select();

      if (error) throw error;

      setTitle('');
      setContent('');
      setCategory('');
      setImage(null);
      setSlug('');
      
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="submit-post-page">
      {!session ? (
        <form onSubmit={handleLogin} className="login-form">
          <h2>Login to Submit Post</h2>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" 
            required 
          />
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" 
            required 
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="post-form">
          <h2>Submit New Post</h2>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Post Title"
            required
          />
          <div className="form-group">
            <label htmlFor="slug">Permalink:</label>
            <div className="slug-input">
              <span className="slug-prefix">/post/</span>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="post-url-slug"
              />
            </div>
          </div>
          <ReactQuill 
            ref={quillRef}
            value={content}
            onChange={setContent}
            modules={modules}
            className="content-editor"
            theme="snow"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="image-upload">
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
            />
            <div className="image-upload-label">
              <span>Drop your image here or click to upload</span>
              {image && <span className="file-name">{image.name}</span>}
            </div>
          </div>
          {image && (
            <img 
              src={URL.createObjectURL(image)} 
              alt="Preview" 
              className="image-preview" 
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              objectFit: 'cover',
              borderRadius: '8px',
              margin: '16px 0'
            }}
          />
          )}
          <button type="submit">Publish Post</button>
        </form>
      )}
    </div>
  );
};
export default SubmitPost;