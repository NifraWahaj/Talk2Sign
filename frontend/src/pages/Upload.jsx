import React, { useState } from "react";
import SubNavbar from "../components/SubNavbar";
import "./Upload.css";
import { useNavigate } from "react-router-dom";


const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Upload");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    console.log(`Active tab changed to: ${tab}`);
  };
  // Inside Upload Component
const navigate = useNavigate();


  const handleFileUpload = (file) => {
    const allowedFormats = ["video/mp4", "audio/mp3", "audio/mpeg", "image/png"];
    if (!allowedFormats.includes(file.type)) {
      setError("Invalid file format. Only MP4, MP3, and PNG are allowed.");
      return;
    }
    setSelectedFile(file); // Set the selected file
    setError(null); // Clear errors
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setError(null);
  };

  const handleConvert = () => {
    console.log("File is being converted:", selectedFile.name);
    // Add your file conversion logic here
    const type = selectedFile.type;
    navigate("/file-processing", { state: { file: selectedFile, type } });
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
              <button className="convert-button" onClick={handleConvert}>
                Convert
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
            <p className="upload-instructions">
              Maximum file size: Audio (500MB), Video (1GB), PNG/JPG (contains 400 words). Only 1 upload.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
