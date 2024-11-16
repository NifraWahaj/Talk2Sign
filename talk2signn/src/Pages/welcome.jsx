import React from 'react';
import Navbar from '../Components/NavBar'; // Import the Navbar component
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../Pages/welcome.css'; // Correct path to the CSS file

const Welcome = () => {
  return (
    <div>
      {/* Navbar Component */}
      <Navbar />

      {/* Welcome Section */}
      <section className="info-area">
        <div className="container">
          <div className="info-content">
            <h1>Welcome to Talk2Sign</h1>
            <h6>
            Bridging Communication with Seamless ASL Translation
            </h6>
            <div className="button-container">
              <button>Get Started</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Welcome;
