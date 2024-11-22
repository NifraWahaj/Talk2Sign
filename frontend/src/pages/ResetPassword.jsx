import React from "react";
import "./ResetPassword.css";

const ResetPassword = () => {
  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Reset your password</h2>
      <p className="reset-password-text">
        Enter your email address and we will send you instructions to reset your password.
      </p>
      <form className="reset-password-form">
        <input
          type="email"
          placeholder="Enter your email address"
          className="reset-password-input"
        />
        <button className="reset-password-button">Continue</button>
      </form>
    </div>
  );
};

export default ResetPassword;
