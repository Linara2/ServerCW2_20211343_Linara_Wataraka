import React from "react";
import { Row, Col } from "react-bootstrap";

function ProfileInfo({ profile }) {
  return (
    <div className="mb-4 text-center">
      <h3 style={{ color: "#433420ff", fontWeight: "bold", fontSize: "32px", marginBottom: "25px", marginTop: "40px", fontFamily: "Arial, sans-serif" }}>{profile.name}</h3>
      <Row className="justify-content-center mt-3">
        <Col xs={3}>
        <strong>{profile.blogposts_count}</strong>
        <div>posts</div>
        </Col>
        <Col xs={3}>
        <strong>{profile.followers_count}</strong>
        <div>followers</div>
        </Col>
        <Col xs={3}>
        <strong>{profile.following_count}</strong>
        <div>following</div>
        </Col>
      </Row>
    </div>
  );
}

export default ProfileInfo;
