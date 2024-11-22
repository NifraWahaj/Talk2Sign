import React from "react";
import { useState } from "react";
import SubNavbar from "../components/SubNavbar";
import { useLocation } from "react-router-dom";
import "./FileProcessing.css";

const FileProcessing = () => {
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Upload");
  const location = useLocation();
  const { file, type } = location.state || {};

  if (!file || !type) {
    return <p className="file-processing-error-message">No file was uploaded. Please upload a file first.</p>;
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    console.log(`Active tab changed to: ${tab}`);
  };

  return (
    <>
      <SubNavbar
        tabs={["Audio/Text", "Upload", "Youtube"]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="file-processing-page">
        <div className="file-processing-container">
          {type === "video/mp4" ? (
            <div className="file-processing-mp4-container">
              <div className="file-processing-video-player">
                <p>MP4 Video Player Placeholder</p>
              </div>
              <div className="file-processing-avatar-placeholder">
                <p>Avatar Animation Goes Here</p>
              </div>
            </div>
          ) : (
            <div className="file-processing-text-avatar-container">
              <div className="file-processing-converted-text-container">
                <p>{`Converted content from the ${type} file will appear here.`}</p>
              </div>
              <div className="file-processing-avatar-placeholder">
                <p>Avatar Animation Goes Here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FileProcessing;
