import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth"; // Import Firebase auth
import "./Profile.css";

const Profile = () => {
  const [userEmail, setUserEmail] = useState(""); // State to store the user's email
  const navigate = useNavigate();
  const auth = getAuth();

  // Fetch the logged-in user's email
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email); // Set the email of the logged-in user
    } else {
      navigate("/login"); // Redirect to login if no user is logged in
    }
  }, [auth, navigate]);

  const handleDeleteRedirect = () => {
    navigate("/delete-account");
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Your Profile</h2>
      <div className="profile-info">
        <div className="profile-item">
          <span className="profile-label">Email:</span>
          <span className="profile-value">{userEmail || "loading..."}</span> {/* Display user's email */}
        </div>
      </div>
      <button className="profile-delete-button" onClick={handleDeleteRedirect}>
        Delete Account
      </button>
    </div>
  );
};

export default Profile;