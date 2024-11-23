import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css"; // Import the CSS file

const Landing = () => {
  return (
    <div className="landing-container">
      <h1 className="landing-title">Welcome to Talk2Sign</h1>
      <p className="landing-subtitle">
        Bridging Communication with Seamless ASL Translation
      </p>
      <Link to="/signup" className="landing-button">
        Get Started
      </Link>
    </div>
  );
};

export default Landing;
