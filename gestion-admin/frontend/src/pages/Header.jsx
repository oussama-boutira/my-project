import React from "react";
import { Link } from "react-router-dom";
import {FaUser} from "react-icons/fa";
import "../styles/header.css";

const Header = () => {
  return (
    <header className="header">
      {/* Main Navbar */}
      <div className="header__info">
        <div className="container">
          <div className="logo">
            <Link to={"/profil"}>
              <img src="/icon-logo.png" className="logo-img" alt="Logo" />
              Massilya & Papa
            </Link>
          </div>

          <nav>
            <ul className="menu">
              <li><Link to={"/reviews"}>Reviews</Link></li>
              <li><Link to={"/voitures"}>Voitures</Link></li>
              <li><Link to={"/appartements"}>Appartements</Link></li>
              <li><Link to={"/agafay"}>Agafay</Link></li>
              <li className="dropdown">
                <p>Reservation ▼</p>
                <ul className="dropdown-menu">
                  <li><Link to={"reservation/voitures"}>Voitures</Link></li>
                  <li><Link to={"/reservation/appartements"}>Appartements</Link></li>
                  <li><Link to={"/reservation/agafay"}>Agafay</Link></li>
                </ul>
              </li>
            </ul>
          </nav>

          <Link to={"/profil"} className="btn-contact"><FaUser/> Profil</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
