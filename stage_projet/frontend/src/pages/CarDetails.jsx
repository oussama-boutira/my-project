import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CommandForm from "../composente/CommandForm";
import "../style/car-detail.css";

import { FaCarSide, FaCogs, FaTachometerAlt, FaGasPump } from "react-icons/fa";
import { BsBuilding } from "react-icons/bs";

const CarDetails = () => {
  const [carData, setCarData] = useState([]);
  const [singleCarItem, setSingleCarItem] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const { slug } = useParams();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/api/car/show');
        setCarData(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des reviews", error);
      }
    };
    fetchReviews();
  }, []); 

  useEffect(() => {
    const foundCar = carData.find((item) => item.carName === slug);
    setSingleCarItem(foundCar);

    if (foundCar?.images?.length > 0) {
      setCurrentImage(foundCar.images[0]);
    }
  }, [carData, slug]);

  if (!singleCarItem) {
    return <p>Car not found</p>;
  }

  const handleImageChange = (image) => {
    setCurrentImage(image);
  };

  return (
    <section className="car-details">
      <div className="container">
        <div className="car-details__wrapper">
          <div className="car-details__image">
            <img src={currentImage} alt={singleCarItem.carName} />
          </div>

          <div className="car-details__info">
            <h2>{singleCarItem.carName}</h2>

            <div className="car-details__meta">
              <p className="price">{singleCarItem.price}.00 Dh/ Day</p>
            </div>

            <p>{singleCarItem.description}</p>

            <div className="car-details__features">
              <p>
                <FaCarSide style={{ color: "#f9a826", marginRight: "8px" }} />
                Model: {singleCarItem.model}
              </p>
              <p>
                <FaCogs style={{ color: "#f9a826", marginRight: "8px" }} />
                Transmission: {singleCarItem.transmission}
              </p>
              <p>
                <FaTachometerAlt style={{ color: "#f9a826", marginRight: "8px" }} />
                Speed: {singleCarItem.speed}
              </p>
              <p>
                <FaGasPump style={{ color: "#f9a826", marginRight: "8px" }} />
                Fuel Type: {singleCarItem.fuel_type}
              </p>
              <p>
                <BsBuilding style={{ color: "#f9a826", marginRight: "8px" }} />
                Brand: {singleCarItem.brand}
              </p>
            </div>
          </div>
        </div>

        {/* Galerie d'images */}
        <div className="image-gallery">
          <h4>Galerie d'images</h4>
          <div className="image-gallery__thumbnails">
            {singleCarItem.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Car ${index + 1}`}
                className="thumbnail"
                onClick={() => handleImageChange(image)}
              />
            ))}
          </div>
        </div>

        <div className="booking-section">
          <h3>Booking Information</h3>
          <CommandForm serviceType="car" itemId={singleCarItem._id} totalPrice={singleCarItem.price}/>
        </div>
      </div>
    </section>
  );
};

export default CarDetails;
