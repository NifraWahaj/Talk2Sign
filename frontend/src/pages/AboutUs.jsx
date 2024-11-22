import React from "react";
import "./AboutUs.css";
import { FaHandsHelping, FaAccessibleIcon, FaHeart } from "react-icons/fa"; // Icons
import { ReactComponent as HeroImage } from "../assets/hero2.svg"; // Example vector (replace with a downloaded one)

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-grid">
        {/* Hero Image */}
        <div className="about-us-hero">
          <HeroImage className="about-us-image" />
        </div>

        {/* About Content */}
        <div className="about-us-content">
          <h2 className="about-us-title">About Talk2Sign</h2>
          <p className="about-us-text">
            At Talk2Sign, we aim to break communication barriers by offering an accessible and seamless platform for ASL users and non-ASL users alike.
          </p>
          <div className="about-us-features">
            <div className="about-us-feature">
              <FaHandsHelping className="about-us-icon" />
              <h3 className="about-us-feature-title">Our Mission</h3>
              <p className="about-us-feature-text">
                To empower communication through innovation and inclusion.
              </p>
            </div>
            <div className="about-us-feature">
              <FaAccessibleIcon className="about-us-icon" />
              <h3 className="about-us-feature-title">Accessibility</h3>
              <p className="about-us-feature-text">
                We are committed to making tools that are easy to use and accessible for everyone.
              </p>
            </div>
            <div className="about-us-feature">
              <FaHeart className="about-us-icon" />
              <h3 className="about-us-feature-title">Community</h3>
              <p className="about-us-feature-text">
                Join a vibrant community dedicated to bridging communication gaps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
