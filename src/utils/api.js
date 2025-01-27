
import axios from 'axios';

const BASE_URL = 'http://localhost/gangolli/wp-json/wp/v2';

export const api = {
  getPosts: (page = 1, perPage = 10, search = '', category = '') => {
    let url = `${BASE_URL}/posts?page=${page}&per_page=${perPage}`;
    if (search) url += `&search=${search}`;
    if (category) url += `&categories=${category}`;
    return axios.get(url);
  },

  getPost: (id) => {
    return axios.get(`${BASE_URL}/posts/${id}`);
  },

  getCategories: () => {
    return axios.get(`${BASE_URL}/categories`);
  },

  getPostsByCategory: (categoryId, perPage = 10) => {
    return axios.get(`${BASE_URL}/posts?categories=${categoryId}&per_page=${perPage}`);
  },

  getComments: (postId) => {
    return axios.get(`${BASE_URL}/comments?post=${postId}`);
  },

  getTags: () => {
    return axios.get(`${BASE_URL}/tags`);
  },

  getMedia: (id) => {
    return axios.get(`${BASE_URL}/media/${id}`);
  }
};

export default api;
