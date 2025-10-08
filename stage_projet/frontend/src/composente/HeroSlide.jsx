import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/HeroSlide.css";

const HeroSlide = () => {
  const [index, setIndex] = useState(0);

  const slides = [
    {
      id: "slider__item-01",
      bgImage: "/IMAGES/Cars/img1.jpg",
      btnName: "voitures",
      LinkName: "Voitures",
    },
    {
      id: "slider__item-02",
      bgImage: "/IMAGES/Agafay/agafay1.jpg",
      btnName: "services d'Agafay",
      LinkName: "Agafay",
    },
    {
      id: "slider__item-03",
      bgImage: "/IMAGES/Apartements/ApImg2.jpg",
      btnName: "appartements",
      LinkName: "Appartements",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div
      className={`slider__item ${slides[index].id}`}
      style={{ backgroundImage: `url(${slides[index].bgImage})` }}
    >
      <div className="slider__content">
        <h1>Reserver maintenant</h1>
        <h4>
          Massilya & Papa vous propose la location de voitures, d'appartements
          et des expériences uniques à Agafay pour un séjour inoubliable au
          Maroc.
        </h4>
        <button className="reserve__btn">
          <Link to={`/${slides[index].LinkName}`}>
            Accéder aux {slides[index].btnName}
          </Link>
        </button>
      </div>
    </div>
  );
};

export default HeroSlide;
