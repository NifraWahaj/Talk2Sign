import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../Components/NavBar.css'; // Correct path to the CSS file

const Navbar = () => {
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
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className="logo col-xxl-1 col-xl-1 col-lg-1 col-md-1 col-sm-2 col-2">
            <a className="navbar-brand" href="#home">
              <img src="talk2sign-brand.png" alt="logo" />
            </a>
          </div>
          <button className="navbar-toggler" type="button" onClick={openSidebar}>
            <i className='bx bx-menu'></i>
          </button>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto d-none d-lg-flex">
              <li className="nav-item">
                <button className="nav-link btn btn-light" aria-current="page">About</button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-light">Convert</button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-light">Logout</button>
              </li>
              <li className="nav-item">
                <button className="profile-button">
                  <img src="profile.svg" alt="Profile" className="profile-icon" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div id="mySidebar" className="sidebar animate-right">
        <div className="closebtn-div">
          <button className="btn btn-large d-lg-none closebtn" onClick={closeSidebar}>
            <i className='bx bx-message-square-x'></i>
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
    </>
  );
};

export default Navbar;
