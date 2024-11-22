import React from "react";
import "./NewPassword.css";

const NewPassword = () => {
  return (
    <div className="new-password-container">
      <h2 className="new-password-title">Enter New Password</h2>
      <p className="new-password-text">Please enter your new password.</p>
      <form className="new-password-form">
        <input
          type="password"
          placeholder="Password"
          className="new-password-input"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="new-password-input"
        />
        <button className="new-password-button">Reset</button>
      </form>
    </div>
  );
};

export default NewPassword;
