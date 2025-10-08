import React, { useState, useEffect } from "react";
import "../styles/ListStyles.css";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/api/reviews/show');
        setReviews(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des reviews", error);
      }
    };
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter((review) =>
    review.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette review ?")) {
      fetch(`/api/reviews/delete/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          setReviews((prev) => prev.filter((review) => review._id !== id));
        })
        .catch((error) => console.error("Erreur lors de la suppression de la review:", error));
    }
  };
  
  

  return (
    <div className="table-container">
      <h2>Gestion des données des reviews</h2>

      <div className="search-container">
        <input
          type="text"
          className="search_inp"
          placeholder="Rechercher par nom"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch />
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReviews.map((review) => (
            <tr key={review._id}>
              <td>{review.name}</td>
              <td>{review.email}</td>
              <td>{review.message}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(review._id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewList;
