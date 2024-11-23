import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./SubNavbar.css";

const SubNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="sub-navbar">
      <div className="sub-navbar-header">
        <button className="hamburger-menu" onClick={toggleMenu}>
          ☰
        </button>
      </div>
      <div className={`sub-navbar-links ${isMenuOpen ? "show" : ""}`}>
        <NavLink
          to="/translator"
          className={({ isActive }) =>
            isActive ? "sub-nav-tab active-sub-tab" : "sub-nav-tab"
          }
          onClick={() => setIsMenuOpen(false)} // Close menu on click
        >
          Audio/Text
        </NavLink>
        <NavLink
          to="/upload"
          className={({ isActive }) =>
            isActive ? "sub-nav-tab active-sub-tab" : "sub-nav-tab"
          }
          onClick={() => setIsMenuOpen(false)} // Close menu on click
        >
          Upload
        </NavLink>
        <NavLink
          to="/youtube"
          className={({ isActive }) =>
            isActive ? "sub-nav-tab active-sub-tab" : "sub-nav-tab"
          }
          onClick={() => setIsMenuOpen(false)} // Close menu on click
        >
          Youtube
        </NavLink>
      </div>
    </div>
  );
};

export default SubNavbar;
