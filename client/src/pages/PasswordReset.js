import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function ResetPassword() {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");
  const [newPassword, setNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        newPassword,
      });
      setResetMessage(response.data.message);
    } catch (error) {
      setResetMessage(error.response?.data?.error || "Reset failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Reset Password</h2>
      <form onSubmit={handleResetSubmit}>
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button className="btn btn-succcess w-100">Reset Password</button>
      </form>
      {resetMessage && <p className="mt-3">{resetMessage}</p>}
    </div>
  );
}

export default ResetPassword;