import React from "react";
import "./Signup.css"; // Import the CSS file

const Signup = () => {
  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up</h2>
      <form className="signup-form">
        <input
          type="text"
          placeholder="Enter your username"
          className="signup-input"
        />
        <input
          type="email"
          placeholder="Enter your email"
          className="signup-input"
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="signup-input"
        />
        <button className="signup-button">Sign Up</button>
      </form>
      <p className="signup-footer">
        Already have an account? <a href="/login" className="signup-link">Login</a>
      </p>
    </div>
  );
};

export default Signup;
