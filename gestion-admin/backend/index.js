import express from "express";
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import AdminRoutes from "./routes/AdminRoutes.js";
import AgafayRoutes from "./routes/AgafayRoutes.js";
import AppartementRoutes from "./routes/AppartementRoutes.js";
import CarRoutes from "./routes/CarRoutes.js";
import ReservationRoutes from "./routes/ReservationRoutes.js";
import ReviewsRoutes from "./routes/ReviewsRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// 📁 Permet d'accéder à /Images/... depuis React
app.use('/Images', express.static(path.join(__dirname, '../../IMAGES')));

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/AgenceDB', {
}).then(() => {
  console.log("Connexion à MongoDB réussie !");
}).catch((err) => {
  console.log("Erreur de connexion à MongoDB", err);
});

// Routes
app.use("/api/admin", AdminRoutes);
app.use("/api/agafay", AgafayRoutes);
app.use("/api/appartement", AppartementRoutes);
app.use("/api/car", CarRoutes);
app.use("/api/reservation", ReservationRoutes);
app.use("/api/reviews", ReviewsRoutes);

// Lancer serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
