import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image'],
      ['clean']
    ]
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
      // First create the post
      const postData = {
        title: title,
        content: content,
        status: 'publish',
        categories: [category]
      };

      const postResponse = await axios.post(
        'http://localhost/gangolli/wp-json/wp/v2/posts',
        postData,
        { headers }
      );

      // If there's an image, upload it and set it as featured media
      if (image) {
        const mediaFormData = new FormData();
        mediaFormData.append('file', image);

        const mediaResponse = await axios.post(
          'http://localhost/gangolli/wp-json/wp/v2/media',
          mediaFormData,
          {
            headers: {
              ...headers,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        // Set the uploaded image as featured media
        await axios.post(
          `http://localhost/gangolli/wp-json/wp/v2/posts/${postResponse.data.id}`,
          { featured_media: mediaResponse.data.id },
          { headers }
        );
      }

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
          <ReactQuill 
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