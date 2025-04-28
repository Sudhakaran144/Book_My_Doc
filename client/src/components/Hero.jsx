import React from "react";
import "../styles/hero.css"; 
import doctorImage from "../images/img1.jpg";

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Healthcare <span className="highlight">Simplified</span>, 
            <br />Appointments <span className="highlight">Streamlined</span>
          </h1>
          <p className="hero-description">
            Connect with top medical professionals at your convenience. 
            Book appointments, receive virtual consultations, and manage your 
            health journey - all in one secure platform.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Find Doctors</button>
            <button className="btn-secondary">Learn More</button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Doctors</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Patients</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Specialties</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="image-container">
            <img src={doctorImage} alt="Healthcare professionals" className="hero-image" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;