import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./ExtractedTextPage.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExtractedTextPage = () => {
  const location = useLocation();
  const { extractedText } = location.state || {};

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (extractedText && extractedText.trim()) {
      sendTextToBackend(extractedText);
    }
  }, [extractedText]);

  const sendTextToBackend = async (text) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/store-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Extracted text sent to backend successfully!", { position: "top-center" });
      } else {
        toast.error(data.error || "Failed to store text in backend.", { position: "top-center" });
      }
    } catch (err) {
      toast.error("Error connecting to server. Ensure backend is running.", { position: "top-center" });
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    console.log("Playing extracted text...");
  };

  const handlePause = () => {
    setIsPlaying(false);
    console.log("Paused.");
  };

  return (
    <div className="extracted-text-page">
      <div className="extracted-text-container">
        <div className="extracted-text-content">
          {extractedText || "No text extracted or an error occurred."}
        </div>

        <div className="animation-placeholder">
          <p className="placeholder-text">Avatar animation goes here</p>
        </div>
      </div>

      <div className="extracted-text-buttons">
        {!isPlaying ? (
          <button className="extracted-play-button" onClick={handlePlay}>
            Play
          </button>
        ) : (
          <button className="extracted-pause-button" onClick={handlePause}>
            Pause
          </button>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default ExtractedTextPage;
