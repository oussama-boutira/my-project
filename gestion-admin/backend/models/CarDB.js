import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  carName: {
    type: String,
    required: true,
  },
  images: {
    type: [String], // Tableau de chaînes de caractères (URLs)
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  speed: {
    type: String,
    required: true,
  },
  transmission: {
    type: String,
    enum: ['Automatic', 'Manual'], // Tu peux adapter si nécessaire
    required: true,
  },
  fuel_type: {
    type: String,
    enum: ['essence', 'diesel', 'electrique', 'hybride'], // Adapte selon tes types
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
}, {
  timestamps: true, // Ajoute createdAt et updatedAt automatiquement
});

const Car = mongoose.model('Car', carSchema);

export default Car;
