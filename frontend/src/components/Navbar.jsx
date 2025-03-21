import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Profile icon
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Navbar.css";
import logo from "../assets/logo.png"; // Your logo here

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  // Monitor user's authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set `isLoggedIn` to true if a user is logged in
    });
    return () => unsubscribe();
  }, [auth]);

  // Handle convert button click
  const handleConvert = () => {
    if (isLoggedIn) {
      navigate("/translator"); // Navigate to the Convert page if logged in
    } else {
      toast.error("Please log in to access the Convert functionality."); // Show error message
    }
  };

  return (
    <nav className="navbar">
      <ToastContainer /> {/* Toast notifications */}
      <div className="navbar-brand">
        <NavLink to="/" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Talk2Sign Logo" className="navbar-logo" />
        </NavLink>
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>
      <div className={`navbar-links ${menuOpen ? "navbar-open" : ""}`}>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={() => setMenuOpen(false)}
        >
          About
        </NavLink>
        <button
          className="navbar-link"
          onClick={() => {
            handleConvert(); // Check login state and navigate or show error
            setMenuOpen(false);
          }}
        >
          Convert
        </button>
        {menuOpen ? (
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </NavLink>
        ) : (
          <NavLink to="/profile" className="navbar-profile-icon">
            <FaUserCircle className="profile-icon" />
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;