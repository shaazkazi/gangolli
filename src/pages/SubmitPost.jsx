import React, { useState } from 'react';
import axios from 'axios';

const SubmitPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
    'Content-Type': 'application/json'
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`http://localhost/gangolli/wp-json/api/v1/token`, {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const token = response.data.jwt_token;
      setToken(token);
      localStorage.setItem('jwt_token', token);

    } catch (error) {
      console.log('Authentication details:', error.response?.data);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('status', 'publish');
      formData.append('categories', category);
      if (image) formData.append('featured_media', image);

      await axios.post('http://localhost/gangolli/wp-json/wp/v2/posts', formData, { headers });
      
      setTitle('');
      setContent('');
      setCategory('');
      setImage(null);
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <div className="submit-post-page">
      {!token ? (
        <form onSubmit={handleLogin} className="login-form">
          <h2>Login to Submit Post</h2>
          <input 
            type="text" 
            name="username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username" 
            required 
          />
          <input 
            type="password" 
            name="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" 
            required 
          />
          <button type="submit">Login</button>
        </form>
      ) : (        <form onSubmit={handleSubmit} className="post-form">
          <h2>Submit New Post</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post Title"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Post Content"
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="1">News</option>
            <option value="2">Events</option>
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
            />
          )}
          <button type="submit">Publish Post</button>
        </form>
      )}
    </div>
  );
};

export default SubmitPost;
