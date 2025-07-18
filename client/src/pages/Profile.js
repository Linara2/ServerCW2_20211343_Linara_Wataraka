import React, { useEffect,useState } from "react";
import axios from "axios";


const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please log in to view your profile.');
      window.location.href = '/login';
      return;
    }

    axios
      .get('http://localhost:5000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setUser(response.data))
      .catch((error) => {
        alert(error.response?.data?.error || 'Failed to fetch user profile');
      });
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      {user ? (
        <pre>{JSON.stringify(user, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile