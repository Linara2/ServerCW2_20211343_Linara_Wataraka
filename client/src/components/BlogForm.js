import React, { useState, useEffect } from "react";
import { createBlog, editBlogPost } from "../api/blogApi";
import { Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";

function BlogForm({ token, refreshBlogs, blog }) {
  const [title, setTitle] = useState(blog ? blog.title : "");
  const [countryName, setCountryName] = useState(blog ? blog.country_name : "");
  const [content, setContent] = useState(blog ? blog.content : "");
  const [dateVisited, setDateVisited] = useState(blog ? blog.date_visited : "");
  const [images, setImages] = useState([]);

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        console.log("Fetching countries...");
        const res = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,capital,languages,currencies,flags"
        );
        console.log("API Response:", res.data);

        const countryNames = res.data
          .map((c) => c?.name?.common)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b)); 

        console.log("Processed country names:", countryNames);
        setCountries(countryNames);
      } catch (err) {
        console.error("Failed to fetch countries:", err.message);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("country_name", countryName);
    formData.append("content", content);
    formData.append("date_visited", dateVisited);
    images.forEach((img) => formData.append("images", img));

    try {
      if (blog) {
        await editBlogPost(token, blog.id, formData);
        alert("Blog post updated successfully");
      } else {
        await createBlog(token, formData);
        alert("Blog post created successfully");
      }
      refreshBlogs();
    } catch (err) {
      console.error("Error submitting blog post:", err);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#fef7c6ff",
        padding: "40px",
        borderRadius: "12px",
        marginBottom: "35px",
      }}
    >
      <h4 style={{ color: "#4b362aff", fontWeight: "bold", marginBottom: "40px", fontFamily: "Arial, sans-serif", fontStyle: "italic" }}>{blog ? "Edit Blog Post Details" : "Enter Blog Post Details"}</h4>

      <Form.Group className="mb-4">
        <Form.Label style={{ fontFamily: "Arial, Roboto, sans-serif"}}>Blog Post Title</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label style={{ fontFamily: "Arial, Roboto, sans-serif"}}>Country</Form.Label>
        {loadingCountries ? (
          <Spinner animation="border" />
        ) : (
          <Form.Select
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
            required
          >
            <option value="">Select a Country from Dropdown</option>
            {countries.map((name, idx) => (
              <option key={idx} value={name}>
                {name}
              </option>
            ))}
          </Form.Select>
        )}
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label style={{ fontFamily: "Arial, Roboto, sans-serif"}}>Blog Post Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label style={{ fontFamily: "Arial, Roboto, sans-serif"}}>Date Visited</Form.Label>
        <Form.Control
          type="date"
          value={dateVisited}
          onChange={(e) => setDateVisited(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label style={{ fontFamily: "Arial, Roboto, sans-serif"}}>Upload Images of your Trip</Form.Label>
        <Form.Control
          type="file"
          multiple
          onChange={(e) => setImages(Array.from(e.target.files))}
        />
      </Form.Group>

      <Button style={{ backgroundColor: "#4b362aff", borderColor: "#4b362aff", marginBottom: "15px", fontFamily: "Arial, Roboto, sans-serif", marginTop: "16px" }} variant="success" type="submit">
        {blog ? "Update Post" : "Create Post"}
      </Button>
    </Form>
  );
}

export default BlogForm;
