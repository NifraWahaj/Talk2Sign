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
      <div className="container mt-4">
        <h1>Welcome to the Youtube</h1>
        <p>This is a demo page with two navbars. The first navbar is a main navigation menu, and the second navbar is for additional options like "Audio/Text," "Upload," and "YouTube".</p>
      </div>
    </div>
  );
};

export default EnterYTLink;
