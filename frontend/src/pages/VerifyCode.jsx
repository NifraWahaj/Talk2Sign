// VerifyCode.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, confirmPasswordReset } from "firebase/auth";
import { useLocation } from "react-router-dom";
import "./VerifyCode.css";

const VerifyCode = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = localStorage.getItem("resetEmail"); // Get the email from localStorage
  const [oobCode, setOobCode] = useState(location.state?.oobCode || "");

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (code !== oobCode) {
      setError("Invalid code. Please try again.");
      return;
    }

    try {
      const auth = getAuth();
      await confirmPasswordReset(auth, oobCode, "");
      console.log("Code verified successfully!");
      navigate("/new-password", { state: { email, oobCode } });  // Redirect to new password page
    } catch (err) {
      console.error("Error verifying code:", err);
      setError("Failed to verify code. Please try again.");
    }
  };

  return (
    <div className="verify-code-container">
      <h2>Enter the 4-digit Code</h2>
      <form onSubmit={handleCodeSubmit}>
        <input
          type="text"
          placeholder="Enter the code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit">Verify Code</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default VerifyCode;
