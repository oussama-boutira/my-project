import React , {useState , useEffect}from 'react'
import axios from 'axios'
import CommonSection from '../composente/CommonSection'
import '../style/Appartement.css'
import ApartmentCard from '../composente/AppartementsItems'
const  Appartements= () => {
    const [AppartementData, SetAppartementData] = useState([])
  
    useEffect(() => {
      const fetchReviews = async () => {
        try {
          const response = await axios.get('/api/appartement/show');
          SetAppartementData(response.data);
        } catch (error) {
          console.error("Erreur lors de la récupération des reviews", error);
        }
      };
      fetchReviews();
    }, []); 
  return (
    <div>
      <CommonSection title={"Les appartements"}/>
      <div className="apartment-container">
            <div className="apartment-list">
            {AppartementData.map((item) => (
                <ApartmentCard key={item._id} apartment={item} />
            ))}
            </div>
       </div>
    </div>
  )
}

export default Appartements
