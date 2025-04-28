import React, { useState } from "react";
import "../styles/contact.css";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

const Contact = () => {
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitStatus, setSubmitStatus] = useState({
    isSubmitting: false,
    submitted: false,
    error: false
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus({ isSubmitting: true, submitted: false, error: false });
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus({ isSubmitting: false, submitted: true, error: false });
      setFormDetails({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ isSubmitting: false, submitted: false, error: false });
      }, 5000);
    }, 1000);
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <div className="contact-info">
          <h2 className="contact-heading">Get In Touch</h2>
          <p className="contact-subheading">
            Have questions or feedback? We're here to help. Send us a message and we'll respond as soon as possible.
          </p>
          
          <div className="contact-methods">
            <div className="contact-method">
              <div className="contact-icon">
                <FaEnvelope />
              </div>
              <div className="contact-method-info">
                <h4>Email Us</h4>
                <p>support@bookmydoc.com</p>
              </div>
            </div>
            
            <div className="contact-method">
              <div className="contact-icon">
                <FaPhone />
              </div>
              <div className="contact-method-info">
                <h4>Call Us</h4>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="contact-method">
              <div className="contact-icon">
                <FaMapMarkerAlt />
              </div>
              <div className="contact-method-info">
                <h4>Visit Us</h4>
                <p>123 Health Avenue, Medical District</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h3>Send Message</h3>
            </div>
            
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="Enter your full name"
                value={formDetails.name}
                onChange={inputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Enter your email address"
                value={formDetails.email}
                onChange={inputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="form-control"
                placeholder="What is this regarding?"
                value={formDetails.subject}
                onChange={inputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                className="form-control"
                placeholder="Enter your message here..."
                value={formDetails.message}
                onChange={inputChange}
                rows="5"
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="submit-button"
              disabled={submitStatus.isSubmitting}
            >
              {submitStatus.isSubmitting ? 'Sending...' : 'Send Message'}
              <span className="button-icon"><FaPaperPlane /></span>
            </button>
            
            {submitStatus.submitted && (
              <div className="form-success">
                Message sent successfully! We'll get back to you soon.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;