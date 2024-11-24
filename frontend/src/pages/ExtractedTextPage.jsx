import React from 'react';
import { useLocation } from 'react-router-dom';
import './ExtractedTextPage.css'; // Import the new CSS file

const ExtractedTextPage = () => {
  const location = useLocation();
  const { extractedText } = location.state || {};

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
    </div>
  );
};

export default ExtractedTextPage;
