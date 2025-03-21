import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./ExtractedTextPage.css";
import { toast, ToastContainer } from "react-toastify";
import SubNavbar from "../components/SubNavbar";
import "react-toastify/dist/ReactToastify.css";

const ExtractedTextPage = () => {
  const location = useLocation();
  console.log("🛠 ExtractedTextPage received location.state:", location.state);

  const extractedTextFromState = location.state?.extractedText || "";

  const [activeTab, setActiveTab] = useState("Audio/Text");
  const [isPlaying, setIsPlaying] = useState(false);
  const [extractedText, setExtractedText] = useState(extractedTextFromState);
  const [translatedText, setTranslatedText] = useState("");

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
        setTranslatedText(data.translated_text); // ✅ Update state with translated text
      } else {
        toast.error(data.error || "Failed to fetch translation.", { position: "top-center" });
      }
    } catch (err) {
      toast.error("Error fetching translated text.", { position: "top-center" });
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
        <div className="extracted-content-wrapper">
          {/* Display Extracted Text */}
          <div className="extracted-text-content">
            <strong>Extracted Text:</strong>
            <p>{extractedText ? extractedText : "No text extracted."}</p>
          </div>

          {/* Display Translated Text */}
          {translatedText && (
            <div className="translator-output">
              <strong>Translated Text:</strong>
              <p>{translatedText}</p>
            </div>
          )}
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
                  {/* Right Section: File Upload */}
          <div className="animation-placeholder">
            <p className="placeholder-text">ASL video goes here</p>
          </div>
       

       
      </div>
      <ToastContainer />
    </div>
  );
};

export default ExtractedTextPage;
