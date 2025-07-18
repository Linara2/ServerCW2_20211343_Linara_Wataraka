import React, { useState, useEffect} from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";

const API_AVATAR = "https://via.placeholder.com/100?text=User";
function ProfileHeader({ userId, token }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  if (loading) return <Spinner animation="border"/>;

  if (!profile) return <p>Profile not found</p>;

  return (
    <div className="text center mb-4">
      <img
        src={profile.avatar ? `http://localhost:5000${profile.profile_image}` : API_AVATAR}
        alt="Profile"
        style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
      />
      <h3 className="mt-2">{profile.name}</h3>
      <p className="text-muted">{profile.email}</p>

      <div className="d-flex justify-content-center mt-2">
        <div className="mx-3">
          <strong>{profile.followers_count}</strong>
          <div>Followers</div>
        </div>
        <div className="mx-3">
          <strong>{profile.following_count}</strong>
          <div>Following</div>
        </div>
        <div className="mx-3">
          <strong>{profile.blogposts_count}</strong>
          <div>Posts</div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader;