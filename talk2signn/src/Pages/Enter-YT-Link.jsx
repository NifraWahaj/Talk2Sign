import React from 'react';
import Navbar from '../Components/NavBar'; // First navbar component
import SecondNavBar from '../Components/SecondNavBar'; // Second navbar component
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../Pages/Enter-YT-Link.css'; 

const EnterYTLink = () => {
  return (
    <div>
      {/* First Navbar */}
      <Navbar />

      {/* Second Navbar */}
      <SecondNavBar />

      {/* Page Content */}
      <div className="page-wrapper">
      <div className="container mt-4 centered-container shadow">
        <h4>Enter YouTube Link</h4>
        <input type="text" id="yt-link" name="yt-link" className="link-input" required placeholder="Enter Youtube link" />
        <button type="submit" className="btn btn-primary">Enter</button>
      </div>
    </div>
    </div>
  );
};

export default EnterYTLink;
