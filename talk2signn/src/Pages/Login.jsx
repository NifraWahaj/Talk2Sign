import React from 'react';
import Navbar from '../Components/NavBar'; 
import '../Pages/Login.css'; 

const Login = () => {
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

      {/* Login Form */}
      <div className="form-container">
        <form className="login-form">
          <h2>Login</h2>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required placeholder="Enter your username"  />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required placeholder="Enter your password" />
          </div>
          <button type="submit">Login</button>
          <p className="login-text">
            Don't have an account? <a href="#" className="login-link">Signup</a>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
