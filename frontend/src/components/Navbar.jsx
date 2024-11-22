import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Profile icon
import "./Navbar.css";
import logo from "../assets/logo.png"; // Your logo here

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
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
        <NavLink
          to="/translator"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={() => setMenuOpen(false)}
        >
          Convert
        </NavLink>
        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={() => setMenuOpen(false)}
        >
          Login
        </NavLink>
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
          <NavLink
            to="/profile"
            className="navbar-profile-icon"
          >
            <FaUserCircle className="profile-icon" />
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
