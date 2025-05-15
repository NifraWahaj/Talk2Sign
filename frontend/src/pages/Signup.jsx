import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Toast notifications
import "./Signup.css"; // Import the CSS file
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import googleLogo from "../assets/google-logo.png"; // Import the Google logo
import eyeIcon from "../assets/icons8-eye-48.png"; // Import your custom eye icon
import eyeSlashIcon from "../assets/icons8-eye-slash-48.png"; // Import your custom eye-slash icon

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
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
          setError("Failed to create account. Check your internet connection.");
      }
      toast.error(err.message);
    }
  };
  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      toast.success("Signed up with Google successfully!");
      navigate("/upload");
    } catch (err) {
      console.error("Error during Google signup:", err);
      toast.error("Failed to sign up with Google. Check your internet connection.");
    }
  };

  return (
    <div className="signup-container">
      <ToastContainer /> {/* Toast notifications */}
      <h2 className="signup-title">Sign Up</h2>
      <button className="google-signup-button" onClick={handleGoogleSignup}>
        <img src={googleLogo} alt="Google Logo" className="google-logo" />
        Sign Up with Google
      </button>
      <div className="or-divider">
        <span className="or-text">OR</span>
      </div>
      
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
      <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"} // Toggle password visibility
            placeholder="Enter your password"
            className="signup-input"
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