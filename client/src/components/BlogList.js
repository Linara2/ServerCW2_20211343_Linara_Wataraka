import React, { useState, useEffect } from "react";
import { getMyBlogPosts, deleteBlogPost } from "../api/blogApi";
import { Button, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BlogList({ token, refreshTrigger, onRefresh }) {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countryDetails, setCountryDetails] = useState({});
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const response = await getMyBlogPosts(token);
      setBlogPosts(response.data);
    } catch (err) {
      console.error("Error fetching blog posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountryInfo = async (countryName) => {
    if (!countryDetails[countryName]) {
      try {
        const res = await axios.get(
          `https://restcountries.com/v3.1/name/${countryName}?fullText=true`
        );
        const data = res.data[0];
        const info = {
          flag: data.flags?.png,
          capital: data.capital?.[0] || "Unknown",
          currency: data.currencies
            ? Object.values(data.currencies)[0].name
            : "Unknown",
        };
        setCountryDetails((prev) => ({ ...prev, [countryName]: info }));
      } catch (err) {
        console.error(`Failed to fetch details for ${countryName}`, err);
      }
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (window.confirm("Do you want to delete this blog post?")) {
      await deleteBlogPost(token, id);
      if (onRefresh) onRefresh();
    }
  };

  const handleEditNavigate = (blogId) => {
    navigate(`/edit-blog/${blogId}`);
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="row">
      {blogPosts.length === 0 && <p>No blog posts found.</p>}

      {blogPosts.map((blog) => {
        const details = countryDetails[blog.country_name];
        if (!details) fetchCountryInfo(blog.country_name);

        const firstImage = blog.images
          ? blog.images.split(",")[0].trim()
          : null;
        const imageUrl = firstImage
          ? `http://localhost:5000${
              firstImage.startsWith("/") ? firstImage : "/" + firstImage
            }`
          : null;

        return (
          <div className="col-md-4 mb-4" key={blog.id}>
            <Card style={{ backgroundColor: "#fff1a4ff" }}>
              {imageUrl && (
                <Card.Img
                  variant="top"
                  src={imageUrl}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}

              <Card.Body>
                <Card.Title
                  style={{
                    cursor: "pointer",
                    color: "#553724ff",
                    fontWeight: "bold",
                  }}
                  onClick={() => navigate(`/view-blog/${blog.id}`)}
                >
                  {blog.title}
                </Card.Title>

                <Card.Text>
                  <strong>Country:</strong> {blog.country_name} <br />
                  {details ? (
                    <>
                      <img src={details.flag} alt="flag" width={30} />{" "}
                      <strong>{details.capital}</strong> •{" "}
                      <em>{details.currency}</em>
                    </>
                  ) : (
                    <small>Loading country info...</small>
                  )}
                  <br />
                  <small>{blog.date_visited}</small>
                </Card.Text>

                <Button style={{ marginBottom: "2px", backgroundColor: "#edfdeeff", borderColor: "#388e3c" }}
                  variant="success"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditNavigate(blog.id)}
                >
                  ✏️
                </Button>

                <Button style={{ marginLeft: "295px", marginBottom: "2px", backgroundColor: "#edfdeeff", borderColor: "#388e3c" }}
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(blog.id)}
                >
                  🗑️
                </Button>
              </Card.Body>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

export default BlogList;
