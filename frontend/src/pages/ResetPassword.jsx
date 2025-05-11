import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("A password reset email has been sent. Please check your inbox.");
      setError(""); // Clear any existing error
      // Optionally, display a popup or toast notification
      setTimeout(() => {
        navigate("/login"); // Redirect to login page after a few seconds
      }, 5555);
    } catch (err) {
      console.error("Error sending password reset email:", err);
      setError("Failed to send password reset email. Please try again.");
      setSuccess(""); // Clear any success message
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Reset your password</h2>
      <p className="reset-password-text">
        Enter your email address, and we will send you a reset link.
      </p>
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email address"
          className="reset-password-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <button className="reset-password-button" type="submit">
          Send Reset Email
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
