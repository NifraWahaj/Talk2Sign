import React, { useState } from "react";
import SubNavbar from "../components/SubNavbar";
import "./Upload.css";
import { useNavigate } from "react-router-dom";
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
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      let response, data;

      if (selectedFile.type.startsWith("image/")) {
        // Image Processing with Google Cloud Vision
        response = await fetch("http://127.0.0.1:5000/api/extract-text", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to process the image.");

        data = await response.json();
        navigate("/extracted-text", { state: { extractedText: data.extracted_text || "No text extracted." } });

      } else if (selectedFile.type.startsWith("audio/")) {
        // Audio Processing with AssemblyAI
        response = await fetch("http://127.0.0.1:5000/api/transcribe-audio", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to transcribe the audio file.");

        data = await response.json();
        navigate("/extracted-text", { state: { extractedText: data.text || "No transcription available." } });
      } else {
        setError("Unsupported file type.");
      }

    } catch (err) {
      console.error("Error:", err);
      setError("Failed to process the file.");
    } finally {
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
