import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, Timestamp } from "firebase/firestore";
import "./VerifyCode.css";

const db = getFirestore(); // Initialize Firestore

const VerifyCode = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const enteredCode = code.join(""); // Combine the code inputs
    if (enteredCode.length !== 4) {
      setError("Please enter the complete 4-digit code.");
      return;
    }

    const email = localStorage.getItem("resetEmail"); // Retrieve email from localStorage
    if (!email) {
      setError("No email found. Please try again.");
      return;
    }

    try {
      const codeDocRef = doc(db, "resetCodes", email); // Reference the Firestore document
      const codeDoc = await getDoc(codeDocRef);

      if (codeDoc.exists()) {
        const { code: storedCode, createdAt } = codeDoc.data();
        const codeAgeInMinutes = (Timestamp.now().seconds - createdAt.seconds) / 60;

        if (storedCode === enteredCode && codeAgeInMinutes <= 15) {
          console.log("Code verified successfully.");
          navigate("/reset-password"); // Navigate to the password reset page
        } else if (codeAgeInMinutes > 15) {
          setError("The code has expired. Please request a new one.");
        } else {
          setError("Invalid code. Please try again.");
        }
      } else {
        setError("No reset code found for this email.");
      }
    } catch (err) {
      console.error("Error verifying code:", err);
      setError("Failed to verify the code. Please try again.");
    }
  };

  return (
    <div className="verify-code-container">
      <h2 className="verify-code-title">Get Your Code</h2>
      <p className="verify-code-text">
        Enter the four-digit code sent to your email.
      </p>
      <form className="verify-code-form" onSubmit={handleSubmit}>
        <div className="verify-code-inputs">
          {code.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="verify-code-input"
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
          ))}
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button className="verify-code-button" type="submit">
          Verify and Proceed
        </button>
      </form>
      <p className="verify-code-footer">
        Didn’t receive the code?{" "}
        <span
          className="verify-code-link"
          onClick={() => window.location.reload()}
        >
          Resend
        </span>
      </p>
    </div>
  );
};

export default VerifyCode;