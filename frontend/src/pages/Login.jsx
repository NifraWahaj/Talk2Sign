import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase"; // Ensure the path matches your project structure
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import googleLogo from "../assets/google-logo.png"; // Import the Google logo
import eyeIcon from "../assets/icons8-eye-48.png"; // Import your custom eye icon
import eyeSlashIcon from "../assets/icons8-eye-slash-48.png"; // Import your custom eye-slash icon
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }
    try {
     // await signInWithEmailAndPassword(auth, email, password);
      const userCred = await signInWithEmailAndPassword(auth, email, password);
          // get Firebase ID token
      const newToken = await userCred.user.getIdToken();
      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

    toast.success("Logged in successfully!");
      toast.success("Logged in successfully!");
      navigate("/upload"); // Redirect to the upload page
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format. Please check and try again.");
          break;
        default:
          setError("Login failed. Please try again later.");
      }
      toast.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
  
    try {
     // const result = await signInWithPopup(auth, provider);
      const userCred = await signInWithPopup(auth, provider);
      toast.success("Logged in with Google successfully!");
              // get Firebase ID token
              const newToken = await userCred.user.getIdToken();
              localStorage.setItem("token", newToken);
              axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;


      navigate("/upload"); // Redirect to the upload page
    } catch (err) {
      console.error("Error during Google login:", err);
      toast.error("Failed to login with Google. Please try again.");
    }
  };
  return (
    <div className="login-container">
      <ToastContainer /> {/* Toast container for notifications */}
      <h2 className="login-title">Login</h2>
      <button className="google-login-button" onClick={handleGoogleLogin}>
        <img src={googleLogo} alt="Google Logo" className="google-logo" />
        Continue with Google
      </button>
      <div className="or-divider">
        <span className="or-text">OR</span>
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"} // Toggle password visibility
            placeholder="Enter your password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <img
            src={showPassword ? eyeSlashIcon : eyeIcon} // Toggle between eye and eye-slash icons
            alt="Toggle Password Visibility"
            className="password-toggle-icon"
            onClick={() => setShowPassword(!showPassword)} // Toggle show/hide password
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error messages */}
        <div className="login-forgot">
          <a href="/forgot-password" className="forgot-password-link">
            Forgot Password?
          </a>
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <p className="login-footer">
        Don’t have an account?{" "}
        <a href="/signup" className="login-link">
          Signup
        </a>
      </p>
    </div>
  );
};

export default Login;