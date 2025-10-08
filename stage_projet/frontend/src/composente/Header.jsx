import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp
} from "react-icons/fa";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import "../style/header.css";

const Header = () => {
  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header__top">
        <div className="container">
          <div className="top-left">
            <a href="tel:+212 715 506 655"><FiPhone /> +212 715 506 655</a>
            <a href="mailto:contact@massilya.com"><FiMail /> contact@massilya&papa.com</a>
            <span><FiMapPin /> Marrakech, Maroc</span>
          </div>
          <div className="top-right">
            <a href="https://www.youtube.com/"><FaFacebookF /></a>
            <a href="https://www.youtube.com/"><FaInstagram /></a>
            <a href="https://www.youtube.com/"><FaWhatsapp/></a>
            <a href="https://www.youtube.com/"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="header__info">
        <div className="container">
          <div className="logo">
            <Link to={"/"}>
              <img src="/icon-logo.png" className="logo-img" alt="Logo" />
              Massilya & Papa
            </Link>
          </div>

          <nav>
            <ul className="menu">
              <li><Link to={"/"}>Accueil</Link></li>
              <li><Link to={"/about"}>About</Link></li>
              <li><Link to={"/Voitures"}>Voitures</Link></li>
              <li><Link to={"/Appartements"}>Appartements</Link></li>
              <li><Link to={"/Agafay"}>Agafay</Link></li>
            </ul>
          </nav>

          <Link to={"/contact"} className="btn-contact">Contact</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
