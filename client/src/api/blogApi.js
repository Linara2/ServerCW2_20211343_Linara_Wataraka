import axios from "axios";

const API_URL = "http://localhost:5000/api/blogs";

export const getMyBlogPosts = async (token) => {
    return axios.get(`${API_URL}/my-blogs`, { headers: { Authorization: `Bearer ${token}` } });
};

export const createBlog = async (token, data) => {
    return axios.post(`${API_URL}/create`, data, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });
};

export const editBlogPost = async (token, blogId, data) => {
    return axios.put(`${API_URL}/edit/${blogId}`, data,{ headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });
};

export const deleteBlogPost = async (token, blogId) => {
    return axios.delete(`${API_URL}/delete/${blogId}`, { headers: { Authorization: `Bearer ${token}` } });
};