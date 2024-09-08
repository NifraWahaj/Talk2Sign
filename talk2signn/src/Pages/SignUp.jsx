import React from 'react';
import Navbar from '../Components/NavBar'; 
import '../Pages/SignUp.css'; 

const SignUp = () => {
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

      {/* Sign Up Form */}
      <div className="SignUpform-container">
        <form className="signup-form">
          <h2>Sign Up</h2>
          <div className="SignUpform-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required placeholder="Enter your username" />
          </div>
          <div className="SignUpform-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required placeholder="Enter your email" />
          </div>
          <div className="SignUpform-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required placeholder="Enter your password"/>
          </div>
          <button type="submit">Sign Up</button>
          <p className="login-text">
            Already have an account? <a href="#" className="login-link">Login</a>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
