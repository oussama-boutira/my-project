import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp
} from "react-icons/fa";
import { FiPhone, FiMail } from "react-icons/fi";
import "../style/Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__logo">
          <img src="/icon-logo.png" alt="Massilya & Papa Logo" className="footer__logo-img" />
          <h2>Massilya & Papa</h2>
          <p>Trust. Elegance. Excellence.</p>
        </div>

        <div className="footer__links-container">
          <div>
            <h5 className="footer__title">Navigation</h5>
            <ul className="footer__links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="footer__title">Services</h5>
            <ul className="footer__links">
              <li><Link to="/Voitures">Voitures</Link></li>
              <li><Link to="/Appartements">Appartements</Link></li>
              <li><Link to="/Agafay">Agafay</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="footer__title">Contact</h5>
            <div className="footer_contact_info">
              <p><FiMail/> : <a href="mailto:contact@massilya.com">contact@massilya&papa.com</a></p>
              <p><FiPhone/> : <a href="tel:+212 715 506 655">+212 715 506 655</a></p>
            </div>
            <div className="footer__socials">
              <p><a href="https://www.youtube.com/"><FaFacebookF/></a></p>
              <p><a href="https://www.youtube.com/"><FaInstagram/></a></p>
              <p><a href="https://www.youtube.com/"><FaWhatsapp/></a></p>
              <p><a href="https://www.youtube.com/"><FaYoutube/></a></p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {year} Massilya & Papa. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
