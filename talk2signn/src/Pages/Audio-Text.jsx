import React from 'react';
import Navbar from '../Components/NavBar'; // First navbar component
import SecondNavBar from '../Components/SecondNavBar'; // Second navbar component
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../Pages/Audio-Text.css'; 

const AudioText = () => {
  return (
    <div>
      {/* First Navbar */}
      <Navbar />

      {/* Second Navbar */}
      <SecondNavBar />

      {/* Page Content */}
      <div className="AudioTextPage-wrapper">
      <div className="AudioTextContainer mt-4 centered-container shadow">
        <input type="text" id="txtinput" name="txtinput" className="txtinput" required placeholder="Type your message" />
        <button type="submit" className="btn1 btn-primary">Convert</button>
        <button type="submit" className="btn2 btn-primary"><img src="mic.svg" alt="mic image"></img>Audio Input</button>
       
        <p>Only Text or Audio can be input at a single instance.</p>
      </div>
    </div>
    </div>
  );
};

export default AudioText;
