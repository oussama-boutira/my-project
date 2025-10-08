import express from 'express';
import Reservation from '../models/ReservationDB.js';
import Car from '../models/CarDB.js';
import Appartement from '../models/AppartementDB.js';
import AgafayService from '../models/AgafayDB.js';

const router = express.Router();

// Créer une nouvelle réservation
router.post('/create', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      type,
      item_id,
      from_address,
      to_address,
      days_count,
      persons_count,
      start_date,
      total_price,
    } = req.body;

    if (!first_name || !last_name || !email || !phone || !type || !item_id || !start_date || !total_price) {
      return res.status(400).json({ message: 'Champs obligatoires manquants.' });
    }

    // 🔹 Trouver et mettre à jour l'élément concerné
    let itemModel;
    if (type === 'car') itemModel = Car;
    else if (type === 'appartement') itemModel = Appartement;
    else if (type === 'service') itemModel = AgafayService;

    const item = await itemModel.findById(item_id);
    if (!item) return res.status(404).json({ message: 'Élément non trouvé.' });

    item.available = false;
    await item.save();

    // 🔹 Créer la réservation
    const newReservation = new Reservation({
      first_name,
      last_name,
      email,
      phone,
      type,
      item_id,
      from_address,
      to_address,
      days_count,
      persons_count,
      start_date,
      total_price,
      typeRef: type === "car" ? "cars" : type === "appartement" ? "appartements" : "agafayservices"
    });

    await newReservation.save();
    res.status(201).json({ message: 'Réservation créée avec succès.', reservation: newReservation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

export default router;
