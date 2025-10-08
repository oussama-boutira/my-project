import React, { useEffect, useState } from "react";
import axios from "axios";
import AgafayCard from "../composente/AgafayItems";
import CommonSection from "../composente/CommonSection";
import "../style/agafay.css";

const Agafay = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/api/agafay/show');
        setServices(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des reviews", error);
      }
    };
    fetchReviews();
  }, []); 

  return (
    <div>
      <CommonSection title="Services Agafay" />
      <div className="agafay-container">
        <div className="agafay-List">
            {services.map((item) => (
            <AgafayCard key={item._id} item={item} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Agafay;
