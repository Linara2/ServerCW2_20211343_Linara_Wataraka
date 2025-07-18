import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import registerImage from "../assets/register.png";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [popup, setPopup] = useState({show: false, message: "", type: ""});

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      setPopup({show: true, message: response.data.message, type: "success"});

      setName("");
      setEmail("");
      setPassword("");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setPopup({show: true, message: error.response?.data?.error || "Registration failed", type: "error"});
    }
  };

  return (
    <>
    <style>{`
    .register-container { display: flex; height: 92.4vh; overflow: hidden; background-color: #e8f5e9; margin: 0; padding: 0; }
    .register-image { flex: 1; display: none; }
    .register-image img { width: 100%; height: 100vh; object-fit: cover; user-select: none; pointer-events: none; }
    @media (min-width: 768px) { .register-image { display: block; } }
    .register-form-container { flex: 1; display: flex; justify-content: center; align-items: center; padding: 24px; }
    .register-form { width: 400px; background-color: #fff; padding: 24px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
    label { display: block; margin-bottom: 8px; font-weight: 600; }
    input[type="email"], input[type="password"], input[type="text"] { width: 100%; padding: 10px; margin-bottom: 20px; border-radius: 6px; border: 1px solid #ccc; font-size: 16px; }
    button[type="submit"] { width: 100%; padding: 12px; background-color: #388e3c; color: #fff; border: none; border-radius: 6px; font-size: 18px; cursor: pointer; font-weight: 600; }
    p.text-center { margin-top: 20px; text-align: center; font-weight: 400; }
    a { color: #388e3c; text-decoration: none; font-weight: 700; }
    .popup { position: fixed; top: 20px; right:20px; padding: 15px 20px; min-width: 250px; color: white, border-radius: 6px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); z-index: 9999; align-items: center; justify-content: center; display: flex; font-weight: 500; font-size: 16px; }
    .popup.error { background-color: #d32f2f; }
    .popup.success { background-color: #388e3c; }
    .popup button { margin-left: 10px; background: none; color: white; border: none; cursor: pointer; font-size: 16px; }
    `}</style>

    {popup.show && (
      <div className={`popup ${popup.type}`}>
        <span>{popup.message}</span>
        <button onClick={() => setPopup({show: false, message: "", type: ""})}>X</button>
      </div>
    )}
    <div className="register-container">
      <div className="register-image">
        <img src={registerImage} alt="Register" draggable="false"/>
      </div>
      <div className="register-form-container">
        <form className="register-form" onSubmit={handleRegister}>
          <h2 style={{color: "#388e3c", textAlign: "center", marginBottom: 35, fontWeight: "bold", marginTop: 10}}>Create an Account</h2>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
          <p className="text-center">Already have an account? {""} <a href="/login">Login</a></p>
        </form>
      </div>
    </div>
    </>
  );
}

export default Register;