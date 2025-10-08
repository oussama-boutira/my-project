import React , {useState , useEffect}from 'react'
import axios from 'axios';
import CommonSection from '../composente/CommonSection'
import CarItem from '../composente/CarItems'
import '../style/Cars.css'
const Cars = () => {
    const [carData, SetCarData] = useState([])
  
    useEffect(() => {
      const fetchReviews = async () => {
        try {
          const response = await axios.get('/api/car/show');
          SetCarData(response.data);
        } catch (error) {
          console.error("Erreur lors de la récupération des reviews", error);
        }
      };
      fetchReviews();
    }, []); 
  return (
    <div>
      <CommonSection title={"Les voitures"}/>
      <div className="car-container">
            <div className="car-list">
            {carData.map((item) => (
                <CarItem key={item._id} item={item} />
            ))}
            </div>
       </div>
    </div>
  )
}

export default Cars
