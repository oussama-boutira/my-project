import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CommandForm from "../composente/CommandForm";
import "../style/appartement-detail.css";

// Icônes
import { FaBed, FaBath, FaBuilding, FaLayerGroup } from "react-icons/fa";
import { MdBalcony } from "react-icons/md";

const ApartmentDetails = () => {
  const { slug } = useParams();
  const [apartmentData, SetApartmentData] = useState([]);
  const [singleApartment, setSingleApartment] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  // Récupérer les appartements depuis l'API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/api/appartement/show');
        SetApartmentData(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des reviews", error);
      }
    };
    fetchReviews();
  }, []); 

  useEffect(() => {
    // Trouver l'appartement correspondant au slug
    if (apartmentData.length > 0) {
      const foundApartment = apartmentData.find((apt) => apt.name === slug);
      setSingleApartment(foundApartment);

      // Si l'appartement est trouvé, définir la première image comme image actuelle
      if (foundApartment?.images?.length > 0) {
        setCurrentImage(foundApartment.images[0]);
      }
    }
  }, [apartmentData, slug]); // Se déclenche lorsque apartmentData ou slug change

  // Si l'appartement n'est pas trouvé ou les images sont manquantes
  if (!singleApartment) {
    return <p>Appartement non trouvé</p>;
  }

  const handleImageChange = (image) => {
    setCurrentImage(image);
  };

  return (
    <section className="apartment-details">
      <div className="container">
        <div className="apartment-details__wrapper">
          <div className="apartment-details__image">
            {/* Afficher une image par défaut si aucune image n'est trouvée */}
            <img
              src={currentImage}
              alt={singleApartment.name}
            />
          </div>

          <div className="apartment-details__info">
            <h2>{singleApartment.name}</h2>
            <div className="apartment-details__meta">
              <p className="price">{singleApartment.price} Dh / nuit</p>
            </div>
            <p>{singleApartment.description}</p>

            <div className="apartment-details__features">
              <p>
                <FaBed style={{ color: "#f9a826", marginRight: "8px" }} />
                Chambres: {singleApartment.bedrooms}
              </p>
              <p>
                <FaBath style={{ color: "#f9a826", marginRight: "8px" }} />
                Salles de bain: {singleApartment.bathrooms}
              </p>
              <p>
                <MdBalcony style={{ color: "#f9a826", marginRight: "8px" }} />
                Balcon: {singleApartment.balcony ? "Oui" : "Non"}
              </p>
              <p>
                <FaLayerGroup style={{ color: "#f9a826", marginRight: "8px" }} />
                Étage: {singleApartment.floor}
              </p>
              <p>
                <FaBuilding style={{ color: "#f9a826", marginRight: "8px" }} />
                Type: {singleApartment.buildingType}
              </p>
            </div>
          </div>
        </div>

        <div className="image-gallery">
          <h4>Galerie d'images</h4>
          <div className="image-gallery__thumbnails">
            {singleApartment.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Appartement ${index + 1}`}
                className="thumbnail"
                onClick={() => handleImageChange(image)}
              />
            ))}
          </div>
        </div>

        <div className="booking-section">
          <h3>Informations de réservation</h3>
          <CommandForm serviceType="appartement" itemId={singleApartment._id} totalPrice={singleApartment.price}/>
        </div>
      </div>
    </section>
  );
};

export default ApartmentDetails;
