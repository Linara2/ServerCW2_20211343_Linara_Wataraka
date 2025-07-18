import React, { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/request-reset", {email});
      setResetMsg(res.data.message);
    } catch (error) {
      setResetMsg(error.response?.data?.error || "Failed to send reset link");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Forgot Password</h2>
      <p>Enter your email to receive a password reset link.</p>
      <form onSubmit={handleForgotSubmit}>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn btn-succcess w-100">Request Password Reset</button>
      </form>
      {resetMsg && <p className="mt-3">{resetMsg}</p>}
    </div>
  );
}

export default ForgotPassword;