import React from 'react';
import Navbar from '../Components/NavBar'; 
import '../Pages/Login.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="vh-100 d-flex flex-column">
      {/* Navbar Component */}
      <Navbar />

      {/* Login Form */}
      <div className="container d-flex justify-content-center align-items-center flex-grow-1">
        <div className="col-lg-5 col-md-8 col-sm-10">
          <form className="login-form bg-light p-4 rounded shadow-sm">
            <h2 className="text-center mb-4">Login</h2>
            <div className="form-group mb-3">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                required
                placeholder="Enter your username"
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                required
                placeholder="Enter your password"
              />
            </div>
            <div className="mb-3 text-end">
              <a href="#" className="forgot-password-link">Forgot Password?</a>
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
            <p className="text-center">
              Don't have an account? <a href="#" className="login-link">Signup</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
