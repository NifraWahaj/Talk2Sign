import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../Components/SecondNavBar.css'; 

const SecondNavBar = () => {
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState('audio');

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mt-2">
      <div className="container-fluid justify-content-center">
        <ul className="navbar-nav">
          <li className="nav-item">
            <button
              className={`nav-link btn ${activeTab === 'audio' ? 'active' : ''}`}
              onClick={() => setActiveTab('audio')}
            >
              Audio/Text
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              Upload
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn ${activeTab === 'youtube' ? 'active' : ''}`}
              onClick={() => setActiveTab('youtube')}
            >
              YouTube
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SecondNavBar;
