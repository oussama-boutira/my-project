import mongoose from "mongoose";

const agafayServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  duration: {
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
  images: {
    type: [String], // Liste des chemins d’images
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true, // Pour createdAt & updatedAt auto
});

const AgafayService = mongoose.model('AgafayService', agafayServiceSchema);
export default AgafayService