import React from "react";
import { Link, useNavigate } from "react-router-dom";

function NavigationBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    alert("Logout successful!");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "#edfdeeff", borderBottom: "1px solid #388e3c" }}>
      <div className="container">
        <Link className="navbar-brand" to="/" style={{ color: "#082f09ff", fontWeight: "bold", fontSize: "24px", marginLeft: "-12px" }}>
          TravelTales
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/search" style={{ color: "#614329ff", fontSize: "17.5px", fontWeight: 500 }}>Search</Link>
            </li>

            {!token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/" style={{ color: "#614329ff", fontSize: "17.5px", fontWeight: 500 }}>Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" style={{ color: "#614329ff", fontSize: "17.5px", fontWeight: 500 }}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" style={{ color: "#614329ff", fontSize: "17.5px", fontWeight: 500 }}>Register</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/user-home" style={{ color: "#614329ff", fontSize: "17.5px", fontWeight: 500 }}>Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile/blogs" style={{ color: "#614329ff", fontSize: "17.5px", fontWeight: 500 }}>Profile</Link>
                </li>
                <li className="nav-item">
                  <button className="btn" onClick={handleLogout} style={{ color: "#614329ff", fontSize: "17.5px", fontWeight: 500 }}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;