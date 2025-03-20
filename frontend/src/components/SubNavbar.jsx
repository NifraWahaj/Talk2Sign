import React from "react";
import { NavLink } from "react-router-dom";
import "./SubNavbar.css";

const SubNavbar = () => {
  return (
    <div className="sub-navbar">
      <div className="sub-navbar-links">
        <NavLink
          to="/translator"
          className={({ isActive }) =>
            isActive ? "sub-nav-tab active-sub-tab" : "sub-nav-tab"
          }
        >
          Audio/Text
        </NavLink>
        <NavLink
          to="/upload"
          className={({ isActive }) =>
            isActive ? "sub-nav-tab active-sub-tab" : "sub-nav-tab"
          }
        >
          Upload
        </NavLink>
        <NavLink
          to="/youtube"
          className={({ isActive }) =>
            isActive ? "sub-nav-tab active-sub-tab" : "sub-nav-tab"
          }
        >
          YouTube
        </NavLink>
      </div>
    </div>
  );
};

export default SubNavbar;
