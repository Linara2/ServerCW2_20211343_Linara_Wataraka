import React, { useState, useEffect} from "react";
import {Container, Button} from "react-bootstrap";
import BlogList from "../components/BlogList";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/profileApi";
import ProfileInfo from "../components/ProfileInfo";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function BlogProfile() {
    const token = localStorage.getItem("token");
    const [profile, setProfile] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const location = useLocation();

    const navigate = useNavigate();

    let userId = null;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.userId;
  }

  const fetchProfile = async () => {
    if (!userId) return;
    try {
      const response = await getProfile(userId, token);
      setProfile(response.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

    useEffect(() => {
        fetchProfile();
    }, [refreshTrigger]);

    const refreshAll = () => setRefreshTrigger((prev) => !prev);

    useEffect(() => {
      if (location.state && location.state.refresh) {
        refreshAll();
        window.history.replaceState({}, document.title);
      }
    }, [location]);

    if (!profile) return <p>Loading...</p>;

    return (
        <Container style={{ marginTop: "30px"}}>
          <ProfileInfo profile={profile} />

          <div className="d-flex justify-content-end my-3">
            <Button style={{ backgroundColor: "#2c3e2cff", borderColor: "#2c3e2cff", fontWeight: "bold"}} variant="success" onClick={() => navigate("/create-blog")}> + Create Blog Post</Button>
          </div>

          <BlogList token={token} refreshTrigger={refreshTrigger} onRefresh={refreshAll}  />
        </Container>
      );
}

export default BlogProfile;