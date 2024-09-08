import React from 'react';
import Navbar from '../Components/NavBar'; // First navbar component
import SecondNavBar from '../Components/SecondNavBar'; // Second navbar component
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../Pages/Confirm-or-Cancel-Upload2.css'; 

const ConfirmorCancelUpload = () => {
  return (
    <div>
      {/* First Navbar */}
      <Navbar />

      {/* Second Navbar */}
      <SecondNavBar />

     {/* Page Content */}
<div className="TextAudiotoASLPage-wrapper">
  <div className="TextAudiotoASLContainer mt-4 centered-container shadow">
    <div className="TextAudiotoASLContainerInner">
      <div className="TextAudiotoASLContainer2 mt-4"></div>
      <div className="TextAudiotoASLContainer3 mt-4"></div>
    </div>
    <div className="ButtonContainer">
      <button type="submit" className="btn1 btn-primary">Pause</button>
      <button type="submit" className="btn2 btn-primary">Replay</button>
    </div>
  </div>
</div>

    </div>
  );
};

export default ConfirmorCancelUpload;
