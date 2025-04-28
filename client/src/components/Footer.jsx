import React from "react";
import "../styles/footer.css";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import { HashLink } from "react-router-hash-link";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo">
            <h2>MedSwift</h2>
            <p>Your health is our priority</p>
          </div>
          
          <div className="footer-nav">
            <div className="footer-column">
              <h3>Quick Links</h3>
              <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/doctors">Doctors</NavLink></li>
                <li><NavLink to="/appointments">Appointments</NavLink></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Support</h3>
              <ul>
                <li><NavLink to="/notifications">Notifications</NavLink></li>
                <li><NavLink to="/contact">Contact Us</NavLink></li>
                <li><NavLink to="/profile">Profile</NavLink></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-social">
            <h3>Connect With Us</h3>
            <div className="social-icons">
              <a href="#" className="social-icon facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="social-icon instagram">
                <FaInstagram />
              </a>
              <a href="#" className="social-icon youtube">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-divider"></div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} HealthConnect. All rights reserved.</p>
          <div className="footer-legal">
            <NavLink to="/privacy">Privacy Policy</NavLink>
            <NavLink to="/terms">Terms of Service</NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;