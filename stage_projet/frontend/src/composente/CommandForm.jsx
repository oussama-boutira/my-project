import React, { useState } from "react";
import axios from "axios"; // IMPORTANT

import "../style/command-form.css";

const CommandForm = ({ serviceType, itemId, totalPrice }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    from_address: "",
    to_address: "",
    days_count: "",
    persons_count: "",
    start_date: "",
    start_time: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const reservationData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        type: serviceType,        // car / appartement / service
        item_id: itemId,           // ID du produit (car, appart, service)
        from_address: serviceType === "car" ? formData.from_address : undefined,
        to_address: serviceType === "car" ? formData.to_address : undefined,
        days_count: (serviceType === "car" || serviceType === "appartement") ? formData.days_count : undefined,
        persons_count: (serviceType === "service" || serviceType === "appartement") ? formData.persons_count : undefined,
        start_date: new Date(`${formData.start_date}T${formData.start_time}`),
        total_price: totalPrice * 
        (serviceType === "car" || serviceType === "appartement" ? formData.days_count : formData.persons_count),
      };

      // Envoyer la réservation au backend
      
      const response = await axios.post('/api/reservation/create', reservationData);

      if (response.status === 201) {
        alert("Réservation réussie !");
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          from_address: "",
          to_address: "",
          days_count: "",
          persons_count: "",
          start_date: "",
          start_time: "",
        });
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la réservation !");
    }
  };


  const today = new Date().toISOString().split("T")[0];

  return (
    <form className="booking-form" onSubmit={submitHandler}>
      <div className="form-group">
        <input 
          type="text" 
          name="first_name" 
          value={formData.first_name} 
          onChange={handleChange} 
          placeholder="First Name" 
          required 
        />
        <input 
          type="text" 
          name="last_name" 
          value={formData.last_name} 
          onChange={handleChange} 
          placeholder="Last Name" 
          required 
        />
      </div>

      <div className="form-group">
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          placeholder="Email" 
          required 
        />
        <input 
          type="text" 
          name="phone" 
          value={formData.phone} 
          onChange={handleChange} 
          placeholder="Phone Number ex: 0612345678" 
          pattern="^0[5-7][0-9]{8}$"
          required 
        />
      </div>

      {serviceType === "car" && (
        <div className="form-group">
          <input 
            type="text" 
            name="from_address" 
            value={formData.from_address} 
            onChange={handleChange} 
            placeholder="From Address" 
            required 
          />
          <input 
            type="text" 
            name="to_address" 
            value={formData.to_address} 
            onChange={handleChange} 
            placeholder="To Address" 
            required 
          />
        </div>
      )}

      {(serviceType === "car" || serviceType === "appartement") && (
        <div className="form-group">
          <input 
            type="number" 
            name="days_count" 
            value={formData.days_count} 
            onChange={handleChange} 
            placeholder="Number of Days"
            min={1}
            max={31} 
            required 
          />
        </div>
      )}

      {(serviceType === "service" || serviceType === "appartement") && (
        <div className="form-group">
          <input 
            type="number" 
            name="persons_count" 
            value={formData.persons_count} 
            onChange={handleChange} 
            placeholder="Number of Persons" 
            min={1}
            max={10}
            required 
          />
        </div>
      )}

      <div className="form-group">
        <input 
          type="date" 
          name="start_date" 
          value={formData.start_date} 
          min={today}
          onChange={handleChange} 
          required 
        />
        <input 
          type="time" 
          name="start_time" 
          value={formData.start_time} 
          onChange={handleChange} 
          required 
        />
      </div>

      <button type="submit" className="btn-submit">Book Now</button>
    </form>
  );
};

export default CommandForm;
