import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogForm from "../components/BlogForm";
import axios from "axios";
import { Container, Spinner } from "react-bootstrap";

const API_URL = "http://localhost:5000/api/blogs";

function EditBlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${API_URL}/my-blogs`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const found = response.data.find((b) => b.id === parseInt(id));
        if (found) {
          setBlog(found);
        } else {
          alert("Blog not found!");
          navigate("/profile/blogs");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate, token]);

  if (loading) return <Spinner animation="border" />;

  return (
    <Container style={{ marginTop: "50px" }}>
      <h2 style={{ color: "#2c3e2cff", fontWeight: "bold", marginBottom: "40px" }}>
        Edit Your Blog Post
      </h2>
      {blog ? (
        <BlogForm blog={blog} token={token} refreshBlogs={() => navigate("/profile/blogs")} />
      ) : (
        <p>Blog Post Not Found...</p>
      )}
    </Container>
  );
}

export default EditBlogPage;