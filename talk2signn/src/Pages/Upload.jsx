import React from 'react';
import Navbar from '../Components/NavBar'; // First navbar component
import SecondNavBar from '../Components/SecondNavBar'; // Second navbar component
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../Pages/Upload.css'; 

const Upload = () => {
  return (
    <div>
      {/* First Navbar */}
      <Navbar />

      {/* Second Navbar */}
      <SecondNavBar />

      {/* Page Content */}
      <div className="uploadPage-wrapper">
      <div className="uploadContainer mt-4 centered-container shadow">
        <p>Upload can be an MP4 video, MP3 audio, or a PNG image.</p>
        <div className="uploadContainer2 mt-4">
        <p>Drag and drop file<br></br> or </p>
        <button type="submit" className="btn btn-primary">Browse</button>
        </div>
        <p>Only mp4, mp3, png, and jpeg files up to X MB. Only upload 1.</p>
      </div>
    </div>
    </div>
  );
};

export default Upload;
