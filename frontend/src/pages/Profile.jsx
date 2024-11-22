import React from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const handleDeleteRedirect = () => {
    navigate("/delete-account");
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Your Profile</h2>
      <div className="profile-info">
        <div className="profile-item">
          <span className="profile-label">Email:</span>
          <span className="profile-value">johndoe@example.com</span>
        </div>
      </div>
      <button className="profile-delete-button" onClick={handleDeleteRedirect}>
        Delete Account
      </button>
    </div>
  );
};

export default Profile;
