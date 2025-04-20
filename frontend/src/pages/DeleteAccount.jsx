import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, deleteUser, signOut } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DeleteAccount.css";

const DeleteAccount = () => {
  const [showModal, setShowModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    } else {
      navigate("/login");
    }
  }, [auth, navigate]);

  const handleDelete = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirm = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const emailToDisplay = user.email;
        await deleteUser(user);
        await signOut(auth);
        toast.success(`Account (${emailToDisplay}) deleted successfully!`);
        navigate("/login");
      } else {
        toast.error("No user is currently logged in.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      if (error.code === "auth/requires-recent-login") {
        toast.error("Account deletion requires recent login. Please log in again and try.");
        navigate("/login");
      } else {
        toast.error("Failed to delete account. Please try again.");
      }
    } finally {
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.className.includes("modal-overlay")) {
      setShowModal(false);
    }
  };

  return (
    <div className="delete-account-wrapper">
      <ToastContainer />
      <h2 className="page-title">Delete Account</h2>
      <p className="intro-text">
        You are logged in as <strong>{userEmail || "loading..."}</strong>.<br />
        Deleting your account is permanent and cannot be undone.
      </p>

      <form className="delete-form" onSubmit={handleDelete}>
        <button type="submit" className="delete-btn">
          Delete Account
        </button>
      </form>

      {showModal && (
        <div className="modal-overlay" onClick={handleOutsideClick}>
          <div className="modal">
            <p className="modal-message">
              Are you sure you want to delete your account?
            </p>
            <div className="modal-buttons">
              <button className="modal-btn confirm" onClick={handleConfirm}>
                Confirm
              </button>
              <button className="modal-btn cancel" onClick={handleCloseModal}>
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
