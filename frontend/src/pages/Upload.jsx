// src/pages/Upload.jsx

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SubNavbar from "../components/SubNavbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Upload.css";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Upload");
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [aslVideoUrl, setAslVideoUrl] = useState(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFileUpload = (file) => {
    const allowed = ["video/mp4", "audio/mp3", "audio/mpeg", "image/png"];
    if (!allowed.includes(file.type)) {
      setError("Invalid file format. Only MP4, MP3, and PNG are allowed.");
      return;
    }
    setSelectedFile(file);
    setError(null);
    setAslVideoUrl(null);
    setConversionProgress(0);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setError(null);
    setAslVideoUrl(null);
    setConversionProgress(0);
  };

  // === HERE: Limit to FIRST 50 CHARACTERS ===
  const convertToASL = async (text) => {
    const limited = text.slice(0, 50);       // ← changed from 200 to 50
    console.log(
      // "Payload to GenASL (first 50 chars):\n",
      JSON.stringify({ Text: limited }, null, 2)
    );
    const url =
      "https://z9h9o5zceb.execute-api.us-west-2.amazonaws.com/prod/sign?Text=" +
      encodeURIComponent(limited);

    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      // console.error("GenASL error body:", body);
      throw new Error(
        `No internet connection. Please check your network settings. ${res.status}: ${body.error || body.message || res.statusText}`
      );
    }
    const { SignURL } = await res.json();
    return SignURL;
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setError("No file selected.");
      return;
    }
  
    setIsProcessing(true);
    setConversionProgress(0);
    setAslVideoUrl(null);
  
    try {
      // 1) get text from your backend
      const formData = new FormData();
      formData.append("file", selectedFile);
  
      let text;
      if (selectedFile.type.startsWith("image/")) {
        const resp = await fetch("http://127.0.0.1:5555/api/extract-text", {
          method: "POST",
          body: formData,
        });
        if (!resp.ok) throw new Error("Failed to process the image. Check your internet connection");
        const data = await resp.json();
        text = data.extracted_text || "No text extracted.";
      } else {
        const resp = await fetch("http://127.0.0.1:5555/api/transcribe-audio", {
          method: "POST",
          body: formData,
        });
        if (!resp.ok) throw new Error("Failed to transcribe the audio file. Check your internet connection");
        const data = await resp.json();
        text = data.text || "No transcription available.";
      }
  
      console.log(
        "Transcript from backend:\n",
        JSON.stringify({ text }, null, 2)
      );
  
      setConversionProgress(50);
  
      // 2) convert only the first 50 chars
      const videoUrl = await convertToASL(text);
  
      // Navigate to ExtractedTextPage and pass the ASL video URL and extracted text
      navigate("/extracted-text", { state: { aslVideoUrl: videoUrl, extractedText: text } });
  
      setConversionProgress(100);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to process the file. Check your internet connection.");
      toast.error(err.message || "Processing failed. Check your internet connection.", {
        position: "top-center",
        autoClose: 5555,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="upload-page">
      <SubNavbar
        tabs={["Audio/Text", "Upload", "YouTube"]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="upload-container">
        {!selectedFile ? (
          <div
            className="upload-drop-area"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleFileUpload(e.dataTransfer.files[0])}
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
            {error && <p className="error-message">{error}</p>}
          </div>
        ) : (
          <div className="uploaded-container">
            <p className="uploaded-filename">{selectedFile.name}</p>

            {isProcessing && (
              <div className="progress-container">
                <progress value={conversionProgress} max="100" />
                <span>{conversionProgress}%</span>
              </div>
            )}

            <div className="action-buttons">
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button
                className="convert-button"
                onClick={handleConvert}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Convert to ASL"}
              </button>
            </div>

            {aslVideoUrl && (
              <div className="asl-video-container">
                <h3>ASL Translation</h3>
                <video
                  ref={videoRef}
                  src={aslVideoUrl}
                  controls
                  autoPlay
                  className="asl-video"
                />
              </div>
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Upload;
