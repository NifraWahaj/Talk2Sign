import React from "react";
import "./Login.css"; // Import the CSS file

const Login = () => {
  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form">
        <input
          type="email"
          placeholder="Enter your email"
          className="login-input"
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="login-input"
        />
        <div className="login-forgot">
          <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
        </div>
        <button className="login-button">Login</button>
      </form>
      <p className="login-footer">
        Don’t have an account? <a href="/signup" className="login-link">Signup</a>
      </p>
    </div>
  );
};

export default Login;
