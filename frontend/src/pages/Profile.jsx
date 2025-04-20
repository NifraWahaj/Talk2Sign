import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDeleteRedirect = () => {
    navigate("/delete-account");
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
      // Update email
      if (newEmail !== userEmail) {
        await verifyBeforeUpdateEmail(user, newEmail, {
          url: window.location.origin + "/verify-email",
          handleCodeInApp: true,
        });
        alert("A verification email has been sent to " + newEmail);
        return;
      }

      // Update password
      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      // Update username (displayName)
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
    <div className="profile-wrapper">
      <h2 className="page-title">Your Profile</h2>
      
      <div className="profile-grid">
        {/* Left Column: Profile Details */}
        <section className="profile-section">
          <h3 className="section-title">Profile Details</h3>
          <div className="profile-item">
            <label className="profile-label">Email</label>
            {editMode ? (
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="profile-input"
              />
            ) : (
              <div className="profile-text">{userEmail || "loading..."}</div>
            )}
          </div>

          <div className="profile-item">
            <label className="profile-label">Username</label>
            {editMode ? (
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="profile-input"
              />
            ) : (
              <div className="profile-text">{username || "loading..."}</div>
            )}
          </div>

          <div className="profile-item">
            <label className="profile-label">Password</label>
            {editMode ? (
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="profile-input"
              />
            ) : (
              <div className="profile-text">********</div>
            )}
          </div>

          <div className="profile-item">
            <label className="profile-label">Date Joined</label>
            <div className="profile-text">{dateOfJoin || "loading..."}</div>
          </div>
        </section>

        {/* Right Column: Account Settings & Danger Zone */}
        <section className="settings-section">
          <div className="account-settings">
            <h3 className="section-title">Account Settings</h3>
            <p className="section-desc">
              Update your account information or log out.
            </p>
            <div className="settings-buttons">
              <button className="edit-button" onClick={toggleEditMode}>
                {editMode ? "Cancel" : "Edit Profile"}
              </button>
              {editMode && (
                <button className="save-button" onClick={handleUpdateProfile}>
                  Save Changes
                </button>
              )}
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <div className="danger-zone">
            <h3 className="danger-title">Danger Zone</h3>
            <p className="danger-desc">
              Deleting your account is irreversible. Proceed with caution.
            </p>
            <button className="delete-button" onClick={handleDeleteRedirect}>
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
