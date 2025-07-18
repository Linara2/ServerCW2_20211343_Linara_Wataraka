import React, { useState } from "react";
import axios from "axios";
import loginImage from "../assets/login.png";
import { useNavigate } from "react-router-dom";

function Login(){
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginSuccess("");

    try{
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      })

      localStorage.setItem("token", response.data.token);
      setLoginSuccess("Successfully Logged In!");

      setTimeout(() => {
        navigate("/user-home");
      }, 1000);
    } catch (err) {
      setLoginError(err.response?.data?.error || "Login failed");
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setResetMessage("");
    try{
      const response = await axios.post("http://localhost:5000/api/auth/request-reset", {
        email: resetEmail,
      });
      setResetMessage(response.data.message);
    }catch (error) {
      setResetMessage(error.response?.data?.error || "Failed to send reset link");
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.post("http://localhost:5000/api/auth/reset-password", {
        token: resetToken,
        newPassword,
      });
      setResetPasswordModal(false);
      setShowForgotModal(false);
      setResetEmail("");
      setResetMessage("");
      setNewPassword("");
      setResetToken("");
    }catch (error) {
      alert(error.response?.data?.error || "Reset failed");
    }
  };

  return (
    <>
    <style>{`.login-container {
      display: flex;
      height: 92.4vh;
      overflow: hidden;
      background-color: #e8f5e9;
      margin: 0;
      padding: 0;
    }
    .login-image {
      flex: 1;
      display: none;
    }
    .login-image img {
      width: 100%;
      height: 100vh;
      object-fit: cover;
      user-select: none;
      pointer-events: none;
    }
    @media (min-width: 768px) {
      .login-image {
        display: block;
      }
    }
    .login-form-container {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 24px;
    }
    .login-form {
      width: 400px;
      background-color: #fff;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .btn-link {
      background: none;
      border: none;
      color: #388e3c;
      text-decoration: underline;
      cursor: pointer;
      font-weight: 600;
      padding: 0;
    }
    .alert-error{
      background-color: #f8d7da;
      color: #721c24;
      padding: 10px 15px;
      border-radius: 6px;
      margin-bottom: 15px;
    }
    .alert-success{
      background-color: #d4edda;
      color: #155724;
      padding: 10px 15px;
      border-radius: 6px;
      margin-bottom: 15px;
    }
    .label{
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
    }
    input[type="email"],
    input[type="password"],
    input[type="text"] {
      width: 100%;
      padding: 10px;
      margin-bottom: 20px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    button[type="submit"] {
      width: 100%;
      padding: 12px;
      background-color: #388e3c;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }
    `}</style>

    <div className="login-container">
      <div className="login-image">
        <img src={loginImage} alt="Login" draggable="false"/>
      </div>
      <div className="login-form-container">
        <div className="login-form">
          <h2 style={{ color: "#388e3c", marginBottom: "40px", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>Login to your account</h2>

          {loginError && <div className="alert alert-error">{loginError}</div>}
          {loginSuccess && <div className="alert alert-success">{loginSuccess}</div>}

          <form onSubmit={handleLogin}>
            <label htmlFor="email" style={{ marginBottom: "8px", fontWeight: "600", display: "block"}}>Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password" style={{ marginBottom: "8px", fontWeight: "600", display: "block"}}>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>

          <p style={{ marginTop: 20, textAlign: "center", fontWeight: "600" }}>
            <button className="btn-link" onClick={() => setShowForgotModal(true)}>
              Forgot Password?
            </button>
          </p>

          <p style={{ marginTop: 10, textAlign: "center" }}>
            Don't have an account?{" "}
            <a href="/register" style={{ color: "#388e3c", textDecoration: "none", fontWeight: "700" }}>
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>

    {showForgotModal && (
      <div role="dialog" aria-modal="true" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050, display: "flex", justifyContent: "center", alignItems: "center" }}
      onClick={() => {
        setShowForgotModal(false);
        setResetMessage("");
        setResetEmail("");
      }}
      >
        <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#fff", padding: 24, borderRadius: 12, width: 400, maxHeight: "90vh", overflowY: "auto" }}>
          <h5 style={{ color: "#388e3c", marginBottom: 16 }}>Forgot Password</h5>

          {!resetMessage ? (
            <form onSubmit={handleForgotSubmit} style={{ display: "flex", flexDirection: "column" }}>
              <p>Enter your email to receive a password reset link.</p>
              <input
                type="email"
                placeholder="Enter email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required style={{ padding: 10, border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 16 }}
              />
              <button type="submit" style={{ padding: 12, backgroundColor: "#388e3c", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>Request Password Reset</button>
            </form>
          ) : (
            <>
            <p>{resetMessage}</p>
            <button onClick={() => {
              setResetPasswordModal(true);
              setResetMessage("");
              }} style={{ padding: "10px 20px", backgroundColor: "#388e3c", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, marginTop: 10 }}>I have the reset token</button>
            </>
          )}
      </div>
    </div>
    )}

    {resetPasswordModal && (
      <div role="dialog" aria-modal="true" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050, display: "flex", justifyContent: "center", alignItems: "center" }}
      onClick={() => setResetPasswordModal(false)}
      >
        <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#fff", padding: 24, borderRadius: 12, width: 400, maxHeight: "90vh", overflowY: "auto" }}>
          <h5 style={{ color: "#388e3c", marginBottom: 16 }}>Reset Password</h5>

          <form onSubmit={handleResetSubmit} style={{ display: "flex", flexDirection: "column" }}>
            <input
              type="text"
              placeholder="Reset Token"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              required style={{ padding: 10, border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 16 }}
            />
            <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required 
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 16 }}
            />
            <button type="submit" style={{ padding: 12, backgroundColor: "#388e3c", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>Reset Password</button>
          </form>
        </div>
      </div>
    )}
    </>
  );
}

export default Login