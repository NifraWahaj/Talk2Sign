import React from "react";
import "./AboutUs.css";
import {
  FaHandsHelping,
  FaAccessibleIcon,
  FaHeart,
  FaUserCircle
} from "react-icons/fa";
import hero2 from "../assets/hero2.svg";

const features = [
  {
    icon: <FaHandsHelping className="about-us-icon" />,
    title: "Our Mission",
    text: "To empower communication through innovation and inclusion."
  },
  {
    icon: <FaAccessibleIcon className="about-us-icon" />,
    title: "Accessibility",
    text: "Easy‑to‑use tools accessible for everyone."
  },
  {
    icon: <FaHeart className="about-us-icon" />,
    title: "Community",
    text: "Join a vibrant community dedicated to bridging gaps."
  }
];

const team = [
  {
    name: "Nifra Wahaj",
    role: "AI/ML Engineer & Backend Developer"
  },
  {
    name: "Rubina Noor",
    role: "Frontend Developer & UX Designer"
  },
  {
    name: "Aman Zeeshan",
    role: "Quality Assurance & Documentation Lead"
  }
];


export default function AboutUs() {
  return (
    <div className="about-us-container">
      <div className="about-us-grid">
        <div className="about-us-hero">
          <img
            src={hero2}
            alt="About Hero"
            className="about-us-image"
          />
        </div>
        <div className="about-us-content">
          <h2 className="about-us-title">About Talk2Sign</h2>
          <p className="about-us-text">
            At Talk2Sign, we break communication barriers by offering an accessible
            and seamless platform for ASL users and non‑ASL users alike.
          </p>
          <div className="about-us-features">
            {features.map((f, i) => (
              <div key={i} className="about-us-feature">
                {f.icon}
                <h3 className="about-us-feature-title">{f.title}</h3>
                <p className="about-us-feature-text">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="about-us-team">
        <h2 className="team-heading">Meet the Team</h2>
        <div className="team-members">
          {team.map((t, i) => (
            <div key={i} className="team-member">
              <FaUserCircle className="member-avatar" />
              <div className="member-name">{t.name}</div>
              <div className="member-role">{t.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="about-us-cta">
        <h2>Ready to Start Translating?</h2>
        <button className="cta-button">Get Started</button>
      </div>
    </div>
  );
}
