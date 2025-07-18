import axios from "axios";

const API_URL = "http://localhost:5000/api/profile";

export const getProfile = async (userId, token) => {
  return axios.get(`${API_URL}/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
