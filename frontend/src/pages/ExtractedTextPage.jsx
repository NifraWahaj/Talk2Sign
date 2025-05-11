
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./ExtractedTextPage.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubNavbar from "../components/SubNavbar";

const ExtractedTextPage = () => {
  const location = useLocation();
  const initialText = location.state?.extractedText || "";
  const initialAslVideoUrl = location.state?.aslVideoUrl || "";

  const [extractedText, setExtractedText] = useState(initialText);
  const [aslVideoUrl, setAslVideoUrl] = useState(initialAslVideoUrl);

  return (
    <div className="extracted-text-page">
      <div className="extracted-text-container">

        {/* ASL Video */}
        <div className="asl-video-placeholder">
          {aslVideoUrl ? (
            <video
              controls
              autoPlay
              muted
              loop
              className="asl-video"
            >
              <source src={aslVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p>No ASL video available.</p>
          )}
        </div>

        {/* Text & Controls */}
        <div className="extracted-right-content">
          <div className="extracted-text-content">
            <strong>Extracted Text:</strong>
            <p>
              {extractedText || "No text extracted."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExtractedTextPage;
