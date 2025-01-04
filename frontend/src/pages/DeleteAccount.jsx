import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, deleteUser, signOut } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DeleteAccount.css";

const DeleteAccount = () => {
  const [showModal, setShowModal] = useState(false);
  const [userEmail, setUserEmail] = useState(""); // State to store the user's email
  const navigate = useNavigate();
  const auth = getAuth();

  // Get the logged-in user's email
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    } else {
      navigate("/login"); // Redirect to login if no user is logged in
    }
  }, [auth, navigate]);
  

  const handleDelete = (e) => {
    e.preventDefault();
    setShowModal(true); // Show confirmation modal
  };

  const handleConfirm = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        // Store the user's email before deleting
        const emailToDisplay = user.email;

        // Delete the user from Firebase Authentication
        await deleteUser(user);

        // Log the user out after deletion
        await signOut(auth);

        // Show success toast with the user's email
        toast.success(`Account (${emailToDisplay}) deleted successfully!`);

        // Redirect to login page
        navigate("/login");
      } else {
        toast.error("No user is currently logged in.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);

      // Handle specific Firebase errors
      if (error.code === "auth/requires-recent-login") {
        toast.error(
          "Account deletion requires recent login. Please log in again and try."
        );
        navigate("/login");
      } else {
        toast.error("Failed to delete account. Please try again.");
      }
    } finally {
      setShowModal(false); // Close the modal
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === "modal-overlay") {
      setShowModal(false); // Close the modal if clicked outside
    }
  };

  return (
    <div className="delete-account-container">
      <ToastContainer /> {/* Toast notifications */}
      <h2 className="delete-account-title">Delete Account</h2>
      <p className="delete-account-text">
        You are logged in as <strong>{userEmail || "loading..."}</strong>. <br />
        Deleting your account is permanent and cannot be undone. Proceed with
        caution.
      </p>
      <form className="delete-account-form" onSubmit={handleDelete}>
        <button type="submit" className="delete-account-button">
          Delete Account
        </button>
      </form>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleOutsideClick}>
          <div className="modal">
            <p className="modal-message">
              Are you sure you want to delete your account?
            </p>
            <div className="modal-buttons">
              <button className="modal-button confirm" onClick={handleConfirm}>
                Confirm
              </button>
              <button className="modal-button cancel" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;