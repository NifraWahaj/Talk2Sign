import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut, updateEmail, updatePassword, updateProfile, verifyBeforeUpdateEmail } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./Profile.css";

const Profile = () => {
  const [userEmail, setUserEmail] = useState(""); // State to store the user's email
  const [username, setUsername] = useState(""); // State to store the user's username
  const [dateOfJoin, setDateOfJoin] = useState(""); // State to store the date of join
  const [editMode, setEditMode] = useState(false); // State to toggle edit mode
  const [newEmail, setNewEmail] = useState(""); // State for new email input
  const [newPassword, setNewPassword] = useState(""); // State for new password input
  const [newUsername, setNewUsername] = useState(""); // State for new username input
  const [profilePhotoURL, setProfilePhotoURL] = useState(""); // State for profile photo URL
  const [newProfilePhoto, setNewProfilePhoto] = useState(null); // State for new profile photo file
  const navigate = useNavigate();
  const auth = getAuth();
  const storage = getStorage();

  // Fetch the logged-in user's details
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email); // Set the email of the logged-in user
      setUsername(user.displayName || user.email.split('@')[0]); // Set the username or fallback to email prefix
      setDateOfJoin(new Date(user.metadata.creationTime).toLocaleDateString()); // Format the date of join
      setProfilePhotoURL(user.photoURL || ""); // Set the profile photo URL
    } else {
      navigate("/login"); // Redirect to login if no user is logged in
    }
  }, [auth, navigate]);

  const handleDeleteRedirect = () => {
    navigate("/delete-account");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      // Pre-fill the form with current values when entering edit mode
      setNewEmail(userEmail);
      setNewPassword(""); // Password should be empty initially
      setNewUsername(username);
      setNewProfilePhoto(null); // Clear new profile photo
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

      // Update profile photo
      if (newProfilePhoto) {
        const storageRef = ref(storage, `profilePhotos/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, newProfilePhoto);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Handle upload progress if needed
          },
          (error) => {
            console.error("Profile photo upload failed:", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateProfile(user, { photoURL: downloadURL });
            setProfilePhotoURL(downloadURL);
          }
        );
      }

      setEditMode(false); // Exit edit mode after update
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleProfilePhotoChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setNewProfilePhoto(event.target.files[0]);
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Your Profile</h2>
      <div className="profile-info">
        <div className="profile-item">
          <span className="profile-label">Email:</span>
          <span className="profile-value">{editMode ? <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} /> : userEmail || "loading..."}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Username:</span>
          <span className="profile-value">{editMode ? <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} /> : username || "loading..."}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Password:</span>
          <span className="profile-value">{editMode ? <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /> : "********"}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Profile Photo:</span>
          <span className="profile-value">
            {editMode ? (
              <input type="file" accept="image/*" onChange={handleProfilePhotoChange} />
            ) : (
              profilePhotoURL ? (
                <img src={profilePhotoURL} alt="Profile" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
              ) : (
                "No photo"
              )
            )}
          </span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Date of Join:</span>
          <span className="profile-value">{dateOfJoin || "loading..."}</span>
        </div>
      </div>
      <button className="profile-edit-button" onClick={toggleEditMode}>
        {editMode ? "Cancel" : "Edit"}
      </button>
      {editMode && (
        <button className="profile-save-button" onClick={handleUpdateProfile}>
          Save
        </button>
      )}
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