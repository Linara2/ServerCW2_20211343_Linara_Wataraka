import React from "react";

function UserHome() {
  const userEmail = localStorage.getItem("userEmail");
  return (
    <div className="container mt-5 text-center">
      <h1 style={{ color: "#388e3c" }}>User Home</h1>
    </div>
  );
}

export default UserHome;