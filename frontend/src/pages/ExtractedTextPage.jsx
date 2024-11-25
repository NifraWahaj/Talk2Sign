import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./ExtractedTextPage.css"; // Import the new CSS file

const ExtractedTextPage = () => {
  const location = useLocation();
  const { extractedText } = location.state || {};

  const [isPlaying, setIsPlaying] = useState(false); // State for Play/Pause toggle

  const handlePlay = () => {
    setIsPlaying(true);
    console.log("Playing extracted text...");
    // Add logic to play audio or animation if needed
  };

  const handlePause = () => {
    setIsPlaying(false);
    console.log("Paused.");
    // Add logic to pause audio or animation if needed
  };

  return (
    <div className="extracted-text-page">
      <div className="extracted-text-container">
        {/* Text Holder */}
        <div className="extracted-text-content">
          {extractedText || "No text extracted or an error occurred."}
        </div>

        {/* Animation Placeholder */}
        <div className="animation-placeholder">
          <p className="placeholder-text">Avatar animation goes here</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="extracted-text-buttons">
        {!isPlaying ? (
          <button
            className="extracted-play-button"
            onClick={handlePlay}
          >
            Play
          </button>
        ) : (
          <button
            className="extracted-pause-button"
            onClick={handlePause}
          >
            Pause
          </button>
        )}
      </div>
    </div>
  );
};

export default ExtractedTextPage;
