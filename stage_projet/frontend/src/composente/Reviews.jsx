import React, { useState, useEffect, useCallback } from 'react';
import { RiUserLine } from 'react-icons/ri'
import axios from 'axios';
import '../style/Reviews.css';

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState([]);

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

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 3 : prevIndex - 1));
  };

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === reviews.length - 3 ? 0 : prevIndex + 1));
  },[reviews.length]);

  // auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext(); 
    }, 5000);
  
    return () => clearInterval(interval);
  }, [goToNext]);
  

  const displayedReviews = reviews.slice(currentIndex, currentIndex + 3); // Show 3 reviews at a time

  return (
    <div className='review'>
        <h2 className='review-title'>Some Clients Reviews</h2>
        <div className="review-container">
            {displayedReviews.map((review) => (
              <div key={review._id} className="review-card">
                <RiUserLine size={30} color="#c08b6d"/>
                <h3 className='client-name'>{review.name}</h3>
                <h4 className='client-mail'>{review.email}</h4>
                <p className='review-message'>
                  <span className='h-review'>Review: </span>
                  {review.message}
                </p>
              </div>
            ))}
        </div>

        <div className="carousel-buttons">
            <button className="prev-button" onClick={goToPrevious}>Prev</button>
            <button className="next-button" onClick={goToNext}>Next</button>
        </div>
    </div>
  );
};

export default Reviews;
