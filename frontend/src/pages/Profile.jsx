import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut, updateEmail, updatePassword, updateProfile, verifyBeforeUpdateEmail } from "firebase/auth";
import "./Profile.css";

const Profile = () => {
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const [dateOfJoin, setDateOfJoin] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const navigate = useNavigate();
  const auth = getAuth();

  // Fetch the logged-in user's details
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
      setUsername(user.displayName || user.email.split('@')[0]);
      setDateOfJoin(new Date(user.metadata.creationTime).toLocaleDateString());
    } else {
      navigate("/login");
    }
  }, [auth, navigate]);

  const handleDeleteRedirect = () => {
    navigate("/delete-account");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setNewEmail(userEmail);
      setNewPassword("");
      setNewUsername(username);
    }
  };

  const handleUpdateProfile = async () => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      if (newEmail !== userEmail) {
        await verifyBeforeUpdateEmail(user, newEmail, {
          url: window.location.origin + "/verify-email",
          handleCodeInApp: true,
        });
        alert("A verification email has been sent to " + newEmail);
        return;
      }

      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      if (newUsername !== username) {
        await updateProfile(user, { displayName: newUsername });
        setUsername(newUsername);
      }

      setEditMode(false);
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Your Profile</h2>
      <div className="profile-info">
        <div className="profile-item">
          <span className="profile-label">Email:</span>
          <span className="profile-value">
            {editMode ? (
              <input type="email" className="profile-input profile-email-input" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            ) : (
              userEmail || "loading..."
            )}
          </span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Username:</span>
          <span className="profile-value">
            {editMode ? (
              <input type="text" className="profile-input profile-username-input" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
            ) : (
              username || "loading..."
            )}
          </span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Password:</span>
          <span className="profile-value">
            {editMode ? (
              <input type="password" className="profile-input profile-password-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            ) : (
              "********"
            )}
          </span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Date of Join:</span>
          <span className="profile-value">
          {editMode ? (
              <input type="text" className="profile-input profile-date-input" value={dateOfJoin} disabled />
            ) : (
              dateOfJoin || "loading..."
            )}
          </span>
        </div>
      </div>

      <div className="profile-buttons">
        <button className="profile-edit-button" onClick={toggleEditMode}>
          {editMode ? "Cancel" : "Edit"}
        </button>
        {editMode && (
          <button className="profile-save-button" onClick={handleUpdateProfile}>
            Save
          </button>
        )}
      </div>

      <button className="profile-delete-button" onClick={handleDeleteRedirect}>
        Delete Account
      </button>
      <button className="profile-logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;

