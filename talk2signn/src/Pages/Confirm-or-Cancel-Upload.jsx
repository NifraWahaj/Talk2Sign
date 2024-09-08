import React from 'react';
import Navbar from '../Components/NavBar'; // First navbar component
import SecondNavBar from '../Components/SecondNavBar'; // Second navbar component
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../Pages/Confirm-or-Cancel-Upload.css'; 

const ConfirmorCancelUpload = () => {
  return (
    <div>
      {/* First Navbar */}
      <Navbar />

      {/* Second Navbar */}
      <SecondNavBar />
   {/* Page Content */}
   <div className="ConfirmorCancelUpload-wrapper">
        <div className="ConfirmorCancelUploadContainer mt-4 centered-container shadow">

          {/* Text at the top */}
          <div className="txtContainer">
            <p>Upload can be an MP4 video, MP3 audio, or a PNG image.</p>
          </div>

          {/* Container holding the file upload area and button container side by side */}
          <div className="uploadButtonWrapper">
            {/* File upload area */}
            <div className="ConfirmorCancelUploadContainer2 mt-4">
              <p>Drag and drop file<br /> or </p>
              <button type="submit" className="btn btn-primary">Browse</button>
            </div>

            {/* Button container to be aligned parallel */}
            <div className="ButtonContainer">
              {/* Text under the upload area */}
              <div className="txtContainer2">
                <p><img src="frame.svg" alt="file img" /> uploaded_file.mp4</p>
              </div>

              <div className="uploadButtonWrapper2">
                <button type="submit" className="btn1 btn-primary">Cancel</button>
                <button type="submit" className="btn2 btn-primary">Convert</button>
              </div>
            </div>
          </div>

          {/* Text container 3 to appear under the file upload and button containers */}
          <div className="txtContainer3">
            <p>Only mp4, mp3, png, and jpeg files up to X MB. Only upload 1.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmorCancelUpload;
