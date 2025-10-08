import React from "react";
import { Link } from "react-router-dom";
import "../style/agafay-item.css";

const AgafayCard = ({ item }) => {
  const { name, duration, description, price, images, available } = item;

  return (
    <div className="agafay-card">
      <img src={images[0]} alt={name} className="agafay-image" />
      <div className="agafay-content">
        <h3>{name}</h3>
        <p className="duration">{duration}</p>
        <p className="description">{description}</p>
        <div className="agafay-price-info">
            <strong>{price} MAD</strong>
            <span className={`availability ${available ? "yes" : "no"}`}>
            {available ? "Disponible" : "Indisponible"}
            </span>
        </div>
        <div className="agafay-buttons">
          <Link to={`/agafay/${name}`} className="car-btn rent">Rent</Link>
          <Link to={`/agafay/${name}`} className="car-btn details">Details</Link>
        </div>
      </div>
    </div>
  );
};

export default AgafayCard;
