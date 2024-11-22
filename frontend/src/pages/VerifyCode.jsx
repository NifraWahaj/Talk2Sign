import React from "react";
import "./VerifyCode.css";

const VerifyCode = () => {
  return (
    <div className="verify-code-container">
      <h2 className="verify-code-title">Get Your Code</h2>
      <p className="verify-code-text">
        Enter the four digit code sent to your email.
      </p>
      <form className="verify-code-form">
        <div className="verify-code-inputs">
          <input type="text" maxLength="1" className="verify-code-input" />
          <input type="text" maxLength="1" className="verify-code-input" />
          <input type="text" maxLength="1" className="verify-code-input" />
          <input type="text" maxLength="1" className="verify-code-input" />
        </div>
        <button className="verify-code-button">Verify and Proceed</button>
      </form>
      <p className="verify-code-footer">
        Didn’t receive the code? <a href="/verify-code" className="verify-code-link">Resend</a>
      </p>
    </div>
  );
};

export default VerifyCode;
