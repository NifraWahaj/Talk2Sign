import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Pages/ForgotPassword.css'; 

const ForgotPassword = () => {
  return (
    <div className="forgot-password-container d-flex flex-column align-items-center justify-content-center vh-100">
         <img
          src="fist.svg" 
          alt="fist logo"
          className="mb-4 logo-icon"
        />

      <div className="text-center reset-password-box">
       
        <h2 className="fw-bold mb-3">Reset your password</h2>
        
       
        <p className="mb-4">
          Enter your email address and we will send you instructions to reset your password.
        </p>
        
        <div className="inputText mb-4 w-100">
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email address"
            required
          />
        </div>

        <button className="btn btn-danger w-100 mb-4">
          Continue
        </button>


      </div>
      <a href="#" className="back-link">
          Back to Talk2Sign Web
        </a>
    </div>
  );
};

export default ForgotPassword;
