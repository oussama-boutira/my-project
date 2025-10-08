import mongoose from "mongoose";

const appartementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  balcony: {
    type: Boolean,
    default: false,
  },
  shower: {
    type: Boolean,
    default: false,
  },
  floor: {
    type: Number,
    required: true,
  },
  buildingType: {
    type: String,
    enum: ["Appartement", "Villa"],
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Appartement = mongoose.model('Appartement', appartementSchema);
export default Appartement