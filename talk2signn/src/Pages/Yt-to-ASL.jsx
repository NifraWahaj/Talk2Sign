import React from 'react';
import Navbar from '../Components/NavBar'; // First navbar component
import SecondNavBar from '../Components/SecondNavBar'; // Second navbar component
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../Pages/Yt-to-ASL.css'; 

const YtToASL = () => {
  return (
    <div>
      {/* First Navbar */}
      <Navbar />

      {/* Second Navbar */}
      <SecondNavBar />

      {/* Page Content */}
      <div className="YttoASLPage-wrapper">
        <div className="YttoASLPageContainer mt-4 centered-container shadow">
          {/* Text at the top */}
          <div className="txtContainer">
            <p>Lorem ipsum dolor sit amet consectetur.</p>
          </div>
          
          {/* Parallel Containers */}
          <div className="YttoASLPageContent">
            <div className="YttoASLPageContainer2 mt-4"></div>
            <div className="YttoASLPageContainer3 mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YtToASL;
