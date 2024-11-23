// frontend/src/pages/ExtractedTextPage.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const ExtractedTextPage = () => {
  const location = useLocation();
  const { extractedText } = location.state || {};

  return (
    <div className="extracted-text-page">
      <h1>Extracted Text</h1>
      {extractedText ? (
        <p>{extractedText}</p>
      ) : (
        <p>No text extracted or an error occurred.</p>
      )}
    </div>
  );
};

export default ExtractedTextPage;