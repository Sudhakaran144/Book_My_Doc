import React from "react";
import image from "../images/aboutimg.jpg";

const AboutUs = () => {
  return (
    <>
      <section className="container">
        <h2 className="page-heading about-heading">About Us</h2>
        <div className="about">
          <div className="hero-img">
            <img
              src={image}
              alt="hero"
            />
          </div>
          <div className="hero-content">
            <p>
            At BookMyDoc, we believe that healthcare should be simple, accessible, and stress-free. Our mission is to bridge the gap between patients and healthcare providers by creating a platform that empowers you to take control of your health with ease.

            With our app, you can find and book appointments with trusted doctors, manage your medical records securely, and even consult online from the comfort of your home. Designed with cutting-edge technology and user convenience in mind, BookMyDoc is committed to delivering a seamless healthcare experience for everyone.

             
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
