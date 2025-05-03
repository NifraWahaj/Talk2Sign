import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./ExtractedTextPage.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExtractedTextPage = () => {
  const location = useLocation();
  const extractedTextFromState = location.state?.extractedText || "";

  const [isPlaying, setIsPlaying] = useState(false);
  const [extractedText, setExtractedText] = useState(extractedTextFromState);
  const [translatedText, setTranslatedText] = useState("");

  const videoRef = useRef(null);

  useEffect(() => {
    if (extractedText && extractedText.trim()) {
      fetchTranslatedText(extractedText);
    }
  }, [extractedText]);

  const fetchTranslatedText = async (text) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/store-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (response.ok) {
        setTranslatedText(data.translated_text);
      } else {
        toast.error(data.error || "Failed to fetch translation.", {
          position: "top-center",
        });
      }
    } catch (err) {
      toast.error("Error fetching translated text.", {
        position: "top-center",
      });
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    videoRef.current?.play();
  };

  const handlePause = () => {
    setIsPlaying(false);
    videoRef.current?.pause();
  };

  return (
    <div className="extracted-text-page">
      <div className="extracted-text-container">
        {/* Video Area */}
        <div className="asl-video-placeholder">
        <video
          className="asl-video"
          controls
          autoPlay
          muted
          loop
        >
             {/* Make changes for video url over here */}

  <source src="/miaa.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
        </div>

        {/* Text and Buttons */}
        <div className="extracted-right-content">
          <div className="extracted-text-content">
            <strong>Extracted Text:</strong>
            <p>{extractedText ? extractedText : "No text extracted."}</p>
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
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ExtractedTextPage;
