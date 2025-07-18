import React, { useState, useEffect} from "react";
import { Container, Spinner, Card, Row, Col, Carousel } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/blogs";

function ViewBlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countryDetails, setCountryDetails] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/my-blogs`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const found = response.data.find((b) => b.id === parseInt(id));
        if (found) {
          setBlog(found);
          fetchCountryInfo(found.country_name);
        } else {
          alert("Blog not found!");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const fetchCountryInfo = async (countryName) => {
      try {
        const response = await axios.get(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        const data = response.data[0];
        setCountryDetails({
          flag: data.flags?.png,
          capital: data.capital?.[0] || "Unknown",
          currency: data.currencies ? Object.values(data.currencies)[0].name : "Unknown",
        });
      } catch (err) {
        console.error("Failed to fetch details", err);
      }
  };

  if (loading) return <Spinner animation="border"/>;

  if (!blog) return <p>Blog not found</p>;

  const  arrayImages = blog.images ? blog.images.split(",") : [];

  return (
    <Container style={{ marginTop: "30px" }}>
      <h2 style={{ color: "#2c3e2cff", fontWeight: "bold", fontSize: "45px", textAlign: "center", marginBottom: "50px", marginTop: "42px" }}>{blog.title}</h2>

      {countryDetails && (
        <Row className="text-center" style={{ marginBottom: "25px" }}>
          <Col>
          <img src={countryDetails.flag} alt="flag" width={70} />
          <p>
            <strong>{blog.country}</strong>
          </p>
          </Col>
          <Col>
          <p>
            <strong>Capital:</strong> {countryDetails.capital}
          </p>
          </Col>
          <Col>
          <p>
            <strong>Currency:</strong> {countryDetails.currency}
          </p>
          </Col>
        </Row>
      )}

      {arrayImages.length > 0 && (
        <Carousel style={{ marginBottom: "20px" }}>
          {arrayImages.map((img, idx) => (
            <Carousel.Item key={idx}>
              <img
                className="d-block w-100"
                src={`http://localhost:5000${img}`}
                alt={`Slide ${idx}`}
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      <Card style={{ backgroundColor: "#ffebd2ff", padding: "20px", marginTop: "20px" }}>
        <p>
          <strong style={{ color: "#743815ff", fontWeight: "bold", fontSize: "18px" }}>Date Visited :</strong> {blog.date_visited}
        </p>
        <p style={{ color: "#000000ff", fontSize: "16px", textAlign: "justify", fontFamily: "serif", lineHeight: "1.5", letterSpacing: "0.5px" }}>{blog.content}</p>
      </Card>
    </Container>
  );
}

export default ViewBlogPage;