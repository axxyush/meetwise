import React from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="container text-center mt-5">
      <h1 className="display-3 mb-3" style={{ color: "#fff" }}>Welcome to MeetWise</h1>
      <p className="lead mb-4" style={{ color: "#fff" }}>
        AI-powered meeting transcription and analysis. Sign up or log in to get started!
      </p>
      <div className="d-flex justify-content-center gap-3">
        <button className="btn btn-primary" onClick={() => navigate("/login")}>Log In</button>
        <button className="btn btn-outline-primary" onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
    </div>
  );
}

export default Landing; 