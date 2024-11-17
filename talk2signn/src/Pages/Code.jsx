import React from 'react';
import Navbar from '../Components/NavBar'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Pages/Code.css'; // Custom CSS file

const GetCode = () => {
  return (
    <div className="vh-100 d-flex flex-column">
      {/* Full-width Navbar */}
      <div className="navbar-container">
        <Navbar />
      </div>

      {/* Main Section */}
      <div className="code-container d-flex flex-column align-items-center justify-content-center flex-grow-1">
        <img
          src="fist.svg" 
          alt="fist logo"
          className="mb-4 logo-icon"
        />

        <h2 className="fw-bold mb-3">Get Your Code</h2>
        <p className="mb-4 text-center">
          Enter the four-digit code sent to your email.
        </p>

        {/* Code input boxes */}
        <div className="code-inputs d-flex justify-content-center mb-4">
          <input type="text" className="form-control code-box mx-2" maxLength="1" />
          <input type="text" className="form-control code-box mx-2" maxLength="1" />
          <input type="text" className="form-control code-box mx-2" maxLength="1" />
          <input type="text" className="form-control code-box mx-2" maxLength="1" />
        </div>

        {/* Verify and Proceed Button */}
        <button className="btn btn-verify w-50 mb-3">
          Verify and Proceed
        </button>

        {/* Resend code and back link */}
        <p className="mb-2">
          Didn't receive the code? <a href="#" className="resend-link">Resend</a>
        </p>

        <a href="#" className="back-link">
          Back to Talk2Sign Web
        </a>
      </div>
    </div>
  );
};

export default GetCode;
