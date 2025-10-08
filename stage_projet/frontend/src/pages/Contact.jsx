import React from "react";
import { Link } from "react-router-dom";
import CommonSection from "../composente/CommonSection";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import "../style/contact.css";

const socialLinks = [
  { url: "#", icon: <FaFacebookF /> },
  { url: "#", icon: <FaInstagram /> },
  { url: "#", icon: <FaYoutube /> },
];

const Contact = () => {

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const message = e.target.message.value;
  
    if (!name || !email || !message) {
      alert("Please fill out all fields.");
      return;
    }
  
    try {
      const response = await fetch('/api/reviews/create', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });
  
      if (response.ok) {
        alert('Message envoyé avec succès !');
        e.target.reset(); 
      } else {
        alert('Erreur lors de l\'envoi du message.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion au serveur.');
    }
  };
  

  return (
    <div className="contact-page">
      <CommonSection title="Contact" />
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-wrapper">
            <div className="contact-form">
              <h6 className="contact-title">Get In Touch</h6>
              <form onSubmit={handleSubmit}>
                <div className="contact-input-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                  />
                </div>
                <div className="contact-input-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                  />
                </div>
                <div className="contact-input-group">
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Message"
                  ></textarea>
                </div>
                <button type="submit" className="contact-btn">Send Message</button>
              </form>
            </div>

            <div className="contact-info">
              <h6 className="fw-bold">Contact Information</h6>
              <p>123 ZindaBazar, Sylhet, Bangladesh</p>
              <div className="contact-details">
                <h6>Phone:</h6>
                <p>+88683896366</p>
              </div>
              <div className="contact-details">
                <h6>Email:</h6>
                <p>example@gmail.com</p>
              </div>
              <div className="contact-details">
                <h6>Follow Us</h6>
                <div className="social-links">
                    {socialLinks.map((item, index) => (
                    <Link to={item.url} key={index} className="social-link-icon">
                        {item.icon}
                    </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
