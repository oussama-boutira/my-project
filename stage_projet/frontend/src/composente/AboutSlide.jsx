import React from "react";
import "../style/AboutSlide.css";
import { AiOutlineCheckCircle } from "react-icons/ai"; // Import check circle icon
import { Link } from "react-router-dom";

const AboutSlide = () => {
  return (
    <section className="about-section">
      {/* Cars */}

      <div className="about-section-content">
        <div className="text-content">
          <h2>Welcome to car rent service</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatum
            blanditiis esse accusantium dignissimos labore laborum. Veniam,
            corporis mollitia temporibus, in quaerat vero deleniti amet dolorem
            repudiandae, pariatur nam dolore! Impedit neque sit ad temporibus
            quam similique dolor ipsam praesentium sunt.
          </p>

          <div className="features-grid">
            <div className="feature-item">
              <AiOutlineCheckCircle className="check-icon" />
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
            <div className="feature-item">
              <AiOutlineCheckCircle className="check-icon" />
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
            <div className="feature-item">
              <AiOutlineCheckCircle className="check-icon" />
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
            <div className="feature-item">
              <AiOutlineCheckCircle className="check-icon" />
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
          </div>
          <button className="about-btn">
            <Link to="/Voitures" className="btn-link">
              Access to Car service
            </Link>
          </button>
        </div>

        <div className="image-content">
          <img src="/IMAGES/Cars/img1Nbg.png" alt="Car Offer" />
        </div>
      </div>

      {/* Apartement */}

      <div className="about-section-content">
        <div className="image-content">
          <img src="/IMAGES/Apartements/ApImg1.jpg" alt="Car Offer" />
        </div>
        <div className="text-content">
          <h2>Welcome to Apartement rent service</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatum
            blanditiis esse accusantium dignissimos labore laborum. Veniam,
            corporis mollitia temporibus, in quaerat vero deleniti amet dolorem
            repudiandae, pariatur nam dolore! Impedit neque sit ad temporibus
            quam similique dolor ipsam praesentium sunt.
          </p>

          <div className="features-grid">
            <div className="feature-item">
              <AiOutlineCheckCircle className="check-icon" />
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
            <div className="feature-item">
              <AiOutlineCheckCircle className="check-icon" />
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
            <div className="feature-item">
              <AiOutlineCheckCircle className="check-icon" />
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
            <div className="feature-item">
              <AiOutlineCheckCircle className="check-icon" />
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
          </div>
          <button className="about-btn">
            <Link to="/Appartements" className="btn-link">
                Access to Apartements service
            </Link>
          </button>
        </div>
      </div>

      {/* Agafay */}

      <div className="about-section-content">
        <div className="text-content">
          <h2>Welcome to Agafay service</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatum
            blanditiis esse accusantium dignissimos labore laborum. Veniam,
            corporis mollitia temporibus, in quaerat vero deleniti amet dolorem
            repudiandae, pariatur nam dolore! Impedit neque sit ad temporibus
            quam similique dolor ipsam praesentium sunt.
          </p>

          <div className="features-grid">
            <div className="feature-item">
              <AiOutlineCheckCircle className="check-icon" />
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
            <div className="feature-item">
              <AiOutlineCheckCircle className="check-icon" />
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
            <div className="feature-item">
              <AiOutlineCheckCircle className="check-icon" />
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
            <div className="feature-item">
              <AiOutlineCheckCircle className="check-icon" />
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
          </div>
          <button className="about-btn">
            <Link to="/Agafay" className="btn-link">
              Access to Agafay service
            </Link>
          </button>
        </div>

        <div className="image-content">
          <img src="/IMAGES/agafay/agafay1.jpg" alt="Car Offer" />
        </div>
      </div>
    </section>
  );
};

export default AboutSlide;
