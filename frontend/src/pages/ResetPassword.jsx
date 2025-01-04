import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";
import "./ResetPassword.css";

const db = getFirestore();

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Function to generate a reset code and store it in Firestore
  const generateAndStoreCode = async (email) => {
    const code = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit code
    const codeDocRef = doc(db, "resetCodes", email);

    await setDoc(codeDocRef, {
      code,
      createdAt: Timestamp.now(),
    });

    console.log(`Code generated for ${email}: ${code}`);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await generateAndStoreCode(email); // Generate and store the reset code
      setSuccess("A reset code has been sent to your email.");
      localStorage.setItem("resetEmail", email); // Store the email for the verification page
      setError(""); // Clear any existing error
      navigate("/verify-code"); // Navigate to the Verify Code page
    } catch (err) {
      console.error("Error generating reset code:", err);
      setError("Failed to send reset code. Please try again.");
      setSuccess(""); // Clear any success message
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Reset your password</h2>
      <p className="reset-password-text">
        Enter your email address, and we will send you a reset code.
      </p>
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email address"
          className="reset-password-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <button className="reset-password-button" type="submit">
          Continue
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;