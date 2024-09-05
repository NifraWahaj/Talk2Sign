import React, { useState } from 'react';
import '../Components/SecondNavBar.css'; // Import CSS for styling

const SecondNavBar = () => {
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    <nav className="secondnavbar">
      <button
        className={`secondnavbar-button ${activeButton === 'audioText' ? 'active' : ''}`}
        onClick={() => handleButtonClick('audioText')}
      >
        Audio/Text
      </button>
      <button
        className={`secondnavbar-button ${activeButton === 'upload' ? 'active' : ''}`}
        onClick={() => handleButtonClick('upload')}
      >
        Upload
      </button>
      <button
        className={`secondnavbar-button ${activeButton === 'youtube' ? 'active' : ''}`}
        onClick={() => handleButtonClick('youtube')}
      >
        YouTube
      </button>
    </nav>
  );
};

export default SecondNavBar;
