import React, { useState } from "react";
import "./DeleteAccount.css";

const DeleteAccount = () => {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirm = () => {
    // Logic for account deletion
    console.log("Account deleted");
    alert("Your account has been deleted.");
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === "modal-overlay") {
      setShowModal(false);
    }
  };

  return (
    <div className="delete-account-container">
      <h2 className="delete-account-title">Delete Account</h2>
      <p className="delete-account-text">
        Enter your email and password to delete the account.
      </p>
      <form className="delete-account-form" onSubmit={handleDelete}>
        <input
          type="email"
          placeholder="Enter email"
          className="delete-account-input"
          required
        />
        <input
          type="password"
          placeholder="Enter password"
          className="delete-account-input"
          required
        />
        <button type="submit" className="delete-account-button">
          Delete Account
        </button>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleOutsideClick}>
          <div className="modal">
            <p className="modal-message">Are you sure you want to delete your account?</p>
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
