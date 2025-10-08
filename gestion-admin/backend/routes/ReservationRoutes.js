import express from 'express';
import mongoose from 'mongoose';
import Reservation from '../models/ReservationDB.js';
import Car from '../models/CarDB.js';
import Appartement from '../models/AppartementDB.js';
import AgafayService from '../models/AgafayDB.js';

const router = express.Router();

// Utilitaire pour trouver un item selon son type
const getItem = async (type, idOrName) => {
  const models = {
    car: Car,
    appartement: Appartement,
    service: AgafayService,
  };
  const Model = models[type];
  if (!Model) return null;

  if (idOrName instanceof mongoose.Types.ObjectId || (typeof idOrName === 'string' && idOrName.length === 24)) {
    const itemById = await Model.findById(idOrName);
    if (itemById) return itemById;
  }
  
  // Recherche par nom si non trouvé par ID
  if (type === 'car') {
    return await Model.findOne({ carName: idOrName });
  } else {
    return await Model.findOne({ name: idOrName });
  }
  
};

// Calcul du prix total
const getTotalPrice = (item, type, days, persons) =>
  (item?.price || 0) * (type === 'service' ? persons : days);

// 🔹 GET - Toutes les réservations d’un type
router.get('/show/:type', async (req, res) => {
  try {
    const reservations = await Reservation.find({ type: req.params.type });

    const result = await Promise.all(reservations.map(async (r) => {
      const item = await getItem(r.type, r.item_id);
      return {
        ...r.toObject(),
        item_name: item ? (item.carName || item.name) : "Nom non trouvé",
        start_date_only: r.start_date?.toISOString().split('T')[0],
        start_time: r.start_date?.toISOString().split('T')[1]?.slice(0, 5),
      };
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 POST - Créer une réservation
// 🔹 POST - Créer une réservation
router.post('/create', async (req, res) => {
  try {
    const { type, item_id, item_name, days_count = 1, persons_count = 1, status = 'En Attente', ...rest } = req.body;

    const item = await getItem(type, item_id || item_name);
    if (!item) return res.status(404).json({ message: "Élément introuvable" });

    // Déterminer disponibilité selon statut
    if (["Annuler", "Terminer"].includes(status)) {
      item.available = true;
    } else if (["En Attente", "Confirmer"].includes(status)) {
      item.available = false;
    }
    await item.save();

    const total_price = getTotalPrice(item, type, days_count, persons_count);

    const newRes = await new Reservation({
      ...rest,
      type,
      item_id: item._id,
      typeRef: type === "car" ? "cars" : type === "appartement" ? "appartements" : "agafayservices",
      days_count,
      persons_count,
      total_price,
      status, // défini ou transmis
    }).save();

    res.status(201).json(newRes);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 🔹 PUT - Modifier une réservation
// 🔹 PUT - Modifier une réservation
router.put('/update/:id', async (req, res) => {
  try {
    const { type, item_id, days_count = 1, persons_count = 1, status = "En Attente" } = req.body;

    const resOld = await Reservation.findById(req.params.id);
    if (!resOld) return res.status(404).json({ message: "Réservation non trouvée" });

    // Si l'item a changé → rendre l'ancien disponible
    if (resOld.item_id.toString() !== item_id) {
      const oldItem = await getItem(resOld.type, resOld.item_id);
      if (oldItem) {
        oldItem.available = true;
        await oldItem.save();
      }
    };

    // Récupérer le nouvel item
    const newItem = await getItem(type, item_id);
    if (!newItem) return res.status(404).json({ message: "Nouvel élément introuvable" });

    // Mettre à jour la disponibilité selon le statut
    if (["Annuler", "Terminer"].includes(status)) {
      newItem.available = true;
    } else if (["En Attente", "Confirmer"].includes(status)) {
      newItem.available = false;
    }
    await newItem.save();

    const total_price = getTotalPrice(newItem, type, days_count, persons_count);

    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        total_price,
        typeRef: type === "car" ? "cars" : type === "appartement" ? "appartements" : "agafayservices",
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// 🔹 DELETE - Supprimer une réservation
router.delete('/delete/:id', async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Réservation non trouvée' });

    const item = await getItem(deleted.type, deleted.item_id);
    if (item) {
      item.available = true;
      await item.save();
    }

    res.json({ message: 'Réservation supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
