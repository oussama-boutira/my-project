import React from "react";
import { Link } from "react-router-dom";
import { RiCarLine, RiSettings2Line, RiTimerFlashLine } from "react-icons/ri";
import { FaGasPump } from "react-icons/fa";
import "../style/car-item.css";

const CarItem = ({ item }) => {
  const { images, model, carName, transmission,available, speed, price, fuel_type } = item;

  return (
    <div className="car-item">
      <div className="car-img">
        <img src={images[0]} alt={carName} className="car-img-full" />
      </div>

      <div className="car-content">
        <h4 className="car-title">{carName}</h4> 

        <div className="info__footer">
          <strong className="car-price">{price} DH <span>/ Day</span></strong>
          <span className={`status ${available ? "available" : "not-available"}`}>
            {available ? "Disponible" : "Indisponible"}
          </span>
        </div>

        <div className="car-info">
          <span><RiCarLine /> {model}</span>
          <span><RiSettings2Line /> {transmission}</span>
          <span><FaGasPump /> {fuel_type}</span>
          <span><RiTimerFlashLine /> {speed}</span>
        </div>

        <div className="car-buttons">
          <Link to={`/cars/${carName}`} className="car-btn rent">Rent</Link>
          <Link to={`/cars/${carName}`} className="car-btn details">Details</Link>
        </div>
      </div>
    </div>
  );
};

export default CarItem;
