import React from 'react';
import Navbar from '../Components/NavBar'; // Adjust the path to the Navbar component as needed
import '../Pages/AboutUs.css'; // Ensure the correct path to your CSS file

const AboutUs = () => {
  // Sidebar functions
  const openSidebar = () => {
    document.getElementById("mySidebar").style.display = "block";
  };

  const closeSidebar = () => {
    document.getElementById("mySidebar").style.display = "none";
  };

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        closeSidebar();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      {/* Navbar Component */}
      <Navbar />

      {/* Sidebar Menu */}
      <div id="mySidebar" className="sidebar animate-right">
        <div className="closebtn-div">
          <button className="btn btn-large d-lg-none closebtn" onClick={closeSidebar}>
            <i className="bx bx-message-square-x"></i>
          </button>
        </div>
        <div id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">About Us</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Convert</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Logout</a>
            </li>
          </ul>
        </div>
      </div>

      {/* About Us Content */}
      <section className="info-area">
        <div className="container">
          <div className="info-content">
            <h1>About Us</h1>
            <h6>
              Bringing text and videos to life in American Sign Language for seamless, inclusive communication.
            </h6>
          </div>
        </div>
      </section>

      {/* Banner Area */}
      <section className="banner-area">
        <div className="container">
          <div className="banner-inner include-bg" style={{ backgroundImage: "url('../images/img2.jpeg')" }}>
            <div className="row">
              <div className="col-xl-5 col-lg-6 col-md-8">
                <div className="banner-content">
                  <img src="mission.jpeg" alt="mission icon" />
                  <h3>Mission</h3>
                  <p>Empowering communication by translating text, audio, and MP4 videos into American Sign Language. Our mission is to ensure everyone has access to clear and inclusive information.</p>
                </div>
              </div>
              <div className="col-xl-5 col-lg-6 col-md-8">
                <div className="banner-content">
                  <img src="vision.png" alt="vision icon" />
                  <h3>Vision</h3>
                  <p>Envisioning a world where communication is seamless and inclusive for all. We aim to bridge language gaps and foster understanding through accessible ASL translations for text, audio, and video.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
