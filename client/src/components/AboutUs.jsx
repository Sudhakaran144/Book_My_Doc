import React from "react";
import "../styles/about.css";
import aboutImage from "../images/img2.jpg"; // Import your image here
import { FaUserMd, FaHeartbeat, FaLaptopMedical } from "react-icons/fa"; // Import icons

const AboutUs = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <h2 className="section-heading">About MediSwift</h2>
        
        <div className="about-intro">
          <div className="about-image-container">
            <img src={aboutImage} alt="Medical team" className="about-image" />
            <div className="image-overlay"></div>
          </div>
          
          <div className="about-content">
            <h3 className="about-tagline">Reimagining Healthcare Access</h3>
            <p className="about-description">
              At MediSwift, we believe healthcare should be simple, accessible, and 
              stress-free. Our platform bridges the gap between patients and healthcare 
              providers, empowering you to take control of your health journey with ease.
            </p>
            <p className="about-description">
              Founded in 2023, we've helped thousands of patients connect with the right 
              medical professionals, manage their appointments efficiently, and receive 
              timely care without the traditional hassles.
            </p>
            <div className="achievement-stats">
              <div className="achievement-item">
                <span className="achievement-number">24/7</span>
                <span className="achievement-text">Support</span>
              </div>
              <div className="achievement-item">
                <span className="achievement-number">98%</span>
                <span className="achievement-text">Satisfaction</span>
              </div>
              <div className="achievement-item">
                <span className="achievement-number">5★</span>
                <span className="achievement-text">Rated</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="about-features">
          <div className="feature-card">
            <div className="feature-icon">
              <FaUserMd />
            </div>
            <h4 className="feature-title">Expert Doctors</h4>
            <p className="feature-description">
              Access our network of verified healthcare professionals across multiple specialties.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaLaptopMedical />
            </div>
            <h4 className="feature-title">Virtual Consultations</h4>
            <p className="feature-description">
              Connect with doctors remotely through secure video appointments when in-person visits aren't necessary.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaHeartbeat />
            </div>
            <h4 className="feature-title">Health Tracking</h4>
            <p className="feature-description">
              Manage your medical records, prescriptions, and appointment history all in one secure place.
            </p>
          </div>
        </div>
        
        <div className="about-mission">
          <h3 className="mission-heading">Our Mission</h3>
          <p className="mission-text">
            To transform healthcare delivery by creating intuitive digital solutions that 
            make quality healthcare accessible to everyone, anytime, anywhere.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;