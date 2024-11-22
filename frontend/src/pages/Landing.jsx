import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to Talk2Sign</h1>
      <p>Bridging Communication with Seamless ASL Translation</p>
      <Link to="/signup" style={styles.button}>
        Get Started
      </Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "2rem",
  },
  button: {
    display: "inline-block",
    marginTop: "1rem",
    padding: "0.8rem 1.5rem",
    backgroundColor: "#D24A69",
    color: "white",
    textDecoration: "none",
    borderRadius: "4px",
    transition: "background-color 0.3s",
  },
};

export default Landing;
