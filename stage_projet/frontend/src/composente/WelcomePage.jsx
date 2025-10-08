import React from 'react';
import "../style/WelcomePage.css"
import { FaMosque} from 'react-icons/fa';
import { Link } from 'react-router-dom';


const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <div className="section-title">
        <p className="subtitle">QUI SOMMES NOUS ?</p>
        <h1 className="title">MASSILYA & PAPA MARRAKECH</h1>
        <div className="divider">
          <span>•</span><span>•</span><span>•</span><span><FaMosque/></span><span>•</span><span>•</span><span>•</span>
        </div>
      </div>
      <div className='all_container'>
        <div className="hero-section" style={{ backgroundImage: `url('/IMAGES/Agafay/agafay2.avif')` }}>
          <div className="hero-overlay">
            <h2>Venez découvrir l'hospitalité marocaine à travers nos services de qualité...</h2>
            <p>
            Massilya & Papa est une agence spécialisée dans la location de voitures et d'appartements au Maroc, 
            avec une forte présence dans la région de Marrakech. Notre mission est de rendre votre séjour plus 
            pratique, confortable et mémorable. En plus de nos services de location, nous vous proposons des 
            expériences uniques dans le désert d'Agafay, où vous pourrez profiter de moments authentiques en 
            pleine nature : balades à dos de chameau, soirées traditionnelles sous les étoiles, et bien plus encore.
            Grâce à notre savoir-faire et à notre sens du service, nous sommes votre partenaire de confiance pour 
            vivre le Maroc autrement.
            </p>
            <button className="cta-button"><Link to={"/about"}>Savoir plus sur nous</Link></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
