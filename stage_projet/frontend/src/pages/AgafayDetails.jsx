import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CommandForm from "../composente/CommandForm";
import "../style/agafay-detail.css";

const AgafayDetails = () => {
  const { slug } = useParams();
  const [agafayData, setAgafayData] = useState([]);
  const [singleService, setSingleService] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/api/agafay/show');
        setAgafayData(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des reviews", error);
      }
    };
    fetchReviews();
  }, []); 

  useEffect(() => {
    const foundService = agafayData.find((service) => service.name === slug);
    setSingleService(foundService);

    if (foundService?.images?.length > 0) {
      setCurrentImage(foundService.images[0]);
    }
  }, [agafayData, slug]);

  const handleImageChange = (image) => {
    setCurrentImage(image);
  };

  if (!singleService) return <p>Service non trouvé</p>;

  return (
    <section className="agafay-details">
      <div className="container">
        <div className="agafay-details__wrapper">
          <div className="agafay-details__image">
            <img src={currentImage} alt={singleService.name} />
          </div>

          <div className="agafay-details__info">
            <h2>{singleService.name}</h2>
            <div className="agafay-details__meta">
              <p className="price">{singleService.price} Dh / personne</p>
              <p className="duration">Durée : {singleService.duration}</p>
            </div>
            <p>{singleService.description}</p>
          </div>
        </div>

        {/* Galerie d'images */}
        <div className="image-gallery">
          <h4>Galerie d'images</h4>
          <div className="image-gallery__thumbnails">
            {singleService.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Service ${i + 1}`}
                className="thumbnail"
                onClick={() => handleImageChange(img)}
              />
            ))}
          </div>
        </div>

        <div className="booking-section">
          <h3>Informations de réservation</h3>
          <CommandForm serviceType="service" itemId={singleService._id} totalPrice={singleService.price}/>
        </div>
      </div>
    </section>
  );
};

export default AgafayDetails;
