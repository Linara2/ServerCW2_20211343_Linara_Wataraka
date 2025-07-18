import React from "react";
import BlogForm from "../components/BlogForm";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

function CreateBlogPage() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  return (
    <Container style={{ marginTop: "50px" }}>
      <h2 style={{ color: "#2c3e2cff", fontWeight: "bold", marginBottom: "40px" }}>Create Your New Blog Post</h2>
      <BlogForm token={token} navigate={navigate} />
    </Container>
  );
}

export default CreateBlogPage;