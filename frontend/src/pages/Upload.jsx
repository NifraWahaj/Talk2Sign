import React, { useState } from "react";
import SubNavbar from "../components/SubNavbar";
import "./Upload.css";
import { useNavigate } from "react-router-dom";
import Tesseract from "tesseract.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Upload");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFileUpload = (file) => {
    const allowedFormats = ["video/mp4", "audio/mp3", "audio/mpeg", "image/png"];
    if (!allowedFormats.includes(file.type)) {
      setError("Invalid file format. Only MP4, MP3, and PNG are allowed.");
      return;
    }
    setSelectedFile(file);
    setError(null);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setError(null);
  };

  const handleConvert = async () => {
  if (!selectedFile) {
    setError("No file selected.");
    return;
  }

  setIsProcessing(true);

  if (selectedFile.type.startsWith("image/")) {
    // Process Image Files with Tesseract.js
    try {
      const { data: { text } } = await Tesseract.recognize(selectedFile, "eng", {
        logger: (m) => console.log(m),
      });
      navigate("/extracted-text", { state: { extractedText: text } });
    } catch (err) {
      console.error("Error during OCR:", err);
      setError("Failed to extract text from image.");
    } finally {
      setIsProcessing(false);
    }
  } else if (selectedFile.type.startsWith("audio/")) {
    // Process Audio Files with AssemblyAI via Flask Backend
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://127.0.0.1:5000/api/transcribe-audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process the audio file.");
      }

      const { text } = await response.json();
      navigate("/extracted-text", { state: { extractedText: text } });
    } catch (err) {
      console.error(err);
      setError("Failed to extract text from audio.");
    } finally {
      setIsProcessing(false);
    }
  } else {
    setError("Unsupported file type.");
    setIsProcessing(false);
  }
};


  return (
    <div className="upload-page">
      <SubNavbar
        tabs={["Audio/Text", "Upload", "Youtube"]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <div className="upload-container">
        {selectedFile ? (
          <div className="uploaded-container">
            <p className="uploaded-filename">{selectedFile.name}</p>
            <div className="action-buttons">
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button
                className="convert-button"
                onClick={handleConvert}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Convert"}
              </button>
            </div>
          </div>
        ) : (
          <div className="upload-section">
            <div
              className="upload-drop-area"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileUpload(e.dataTransfer.files[0]);
              }}
            >
              <p>Drag and drop file</p>
              <p>or</p>
              <button
                className="browse-button"
                onClick={() => document.getElementById("fileInput").click()}
              >
                Browse
              </button>
              <input
                id="fileInput"
                type="file"
                accept=".mp4, .mp3, .png"
                style={{ display: "none" }}
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
            </div>
            {error && <p className="error-message">{error}</p>}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Upload;
