// components/ApartmentCard.jsx

import React from "react";
import { Link } from "react-router-dom";
import {
  FaBath,
  FaBed,
  FaShower,
  FaBuilding,
  FaMapMarkerAlt,
  FaDoorOpen 
} from "react-icons/fa";

import "../style/appartement-item.css";

const ApartmentCard = ({ apartment }) => {
  const {
    name,
    address,
    price,
    bedrooms,
    bathrooms,
    balcony,
    shower,
    floor,
    buildingType,
    images,
    available,
  } = apartment;

  return (
    <div className="apartment__card">
      <div className="apartment__img">
        <img src={images[0]} alt={name} />
      </div>
      <div className="apartment__content">
        <h3>{name}</h3>
        <p className="apartment__address"><FaMapMarkerAlt /> {address}</p>

        <div className="info__row">
          <span><FaBed /> {bedrooms} ch.</span>
          <span><FaBath /> {bathrooms} sdb</span>
        </div>
        <div className="info__row">
          {balcony && <span><FaDoorOpen/> Balcon</span>}
          {shower && <span><FaShower /> Douche</span>}
        </div>
        <div className="info__row">
          <span>Étage : {floor}</span>
          <span><FaBuilding /> {buildingType}</span>
        </div>

        <div className="info__footer">
          <strong>{price} DH / jours</strong>
          <span className={`status ${available ? "available" : "not-available"}`}>
            {available ? "Disponible" : "Indisponible"}
          </span>
        </div>
        <div className="car-buttons">
          <Link to={`/appartements/${name}`} className="car-btn rent">Rent</Link>
          <Link to={`/appartements/${name}`} className="car-btn details">Details</Link>
        </div>
      </div>
    </div>
  );
};

export default ApartmentCard;
