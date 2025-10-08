import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },

  type: { 
    type: String, 
    enum: ['car', 'appartement', 'service'], 
    required: true 
  }, // Type de service réservé

  item_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    refPath: 'typeRef' 
  },

  typeRef: { 
    type: String, 
    required: true, 
    enum: ['cars', 'appartements', 'agafayservices'] 
  },

  // Champs spéciaux pour certains services :
  from_address: { type: String }, // utilisé pour car
  to_address: { type: String },   // utilisé pour car
  days_count: { type: Number },    // utilisé pour car et appartement
  persons_count: { type: Number }, // utilisé pour appartement et agafay

  start_date: { type: Date, required: true },

  total_price: { type: Number, required: true },

  status: { 
    type: String, 
    enum: ['En Attente', 'Confirmer', 'Annuler', 'Terminer'], 
    default: 'En Attente' 
  },

  created_at: { type: Date, default: Date.now }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
