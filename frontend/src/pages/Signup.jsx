import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Toast notifications
import "./Signup.css"; // Import the CSS file

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user's profile with the username
      await updateProfile(user, {
        displayName: username,
      });

      // Show success toast
      toast.success("Account created successfully!");

      // Redirect to upload page
      navigate("/upload");
    } catch (err) {
      console.error("Error during signup:", err);
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already in use.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        case "auth/weak-password":
          setError("Password must be at least 6 characters.");
          break;
        default:
          setError("Failed to create account. Please try again.");
      }
      toast.error(err.message);
    }
  };

  return (
    <div className="signup-container">
      <ToastContainer /> {/* Toast notifications */}
      <h2 className="signup-title">Sign Up</h2>
      <form className="signup-form" onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Enter your username"
          className="signup-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter your email"
          className="signup-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="signup-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Display errors */}
        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>
      <p className="signup-footer">
        Already have an account?{" "}
        <a href="/login" className="signup-link">
          Login
        </a>
      </p>
    </div>
  );
};

export default Signup;