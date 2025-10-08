import express from 'express';
import mongoose from 'mongoose';

// real data
import AgafayRoutes from "./routes/AgafayRoutes.js";
import AppartementRoutes from "./routes/AppartementRoutes.js";
import CarRoutes from "./routes/CarRoutes.js";
import ReservationRoutes from "./routes/ReservationRoutes.js";
import ReviewsRoutes from "./routes/ReviewsRoutes.js";

const app = express();
app.use(express.json());


app.use('/Images', express.static('../../IMAGES'));
const PORT = process.env.PORT || 5001;

// connection to MongoDB
mongoose.connect('mongodb://localhost:27017/AgenceDB', {
}).then(() => {
  console.log("Connexion à MongoDB réussie !");
}).catch((err) => {
  console.log("Erreur de connexion à MongoDB", err);
});

app.use("/api/agafay", AgafayRoutes);
app.use("/api/appartement", AppartementRoutes);
app.use("/api/car", CarRoutes);
app.use("/api/reservation", ReservationRoutes);
app.use("/api/reviews", ReviewsRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});