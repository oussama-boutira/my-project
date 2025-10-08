import express from 'express';
import Car from '../models/CarDB.js'
import Reservation from '../models/ReservationDB.js';
import upload from '../middlewares/CarsUpload.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/show', async (req, res) => {
    try {
        const car = await Car.find();
        res.status(200).json(car);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Création d'un service Car
router.post('/create', upload.array('images', 3), async (req, res) => {
    const { brand, carName, model, price, available, speed, transmission, fuel_type, description } = req.body;
  
    const images = req.files.map(file => {
      const filePath = path.join(__dirname, '../../../IMAGES/Cars', file.filename);
      if (!fs.existsSync(filePath)) {
          console.log(`⚠️ Le fichier ${file.filename} n'a pas été enregistré physiquement (il existait déjà).`);
      }

      return `/Images/Cars/${file.filename}`;
    });
  
    const newCar = new Car({
      brand,
      carName,
      model,
      price,
      available,
      speed,
      transmission,
      fuel_type,
      description,
      images
    });
  
    try {
      const savedCar = await newCar.save();
      res.status(201).json(savedCar);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  


// Modification d'un service Car
router.put('/update/:id', upload.array('images', 3), async (req, res) => {
    const { brand, carName, model, price, available, speed, transmission, fuel_type, description } = req.body;
  
    try {
      const oldCar = await Car.findById(req.params.id);
      if (!oldCar) {
        return res.status(404).json({ message: 'Car non trouvé' });
      }
  
      // Anciennes images
      let oldImages = oldCar.images || [];
  
      // Commencer avec les anciennes images
      let newImages = [...oldImages];
  
      if (req.files.length > 0) {
        req.files.forEach((file, index) => {
          const imagePath = `/Images/Cars/${file.filename}`;
          newImages[index] = imagePath;
        });
      }
  
      const updatedCar = await Car.findByIdAndUpdate(
        req.params.id,
        {
          brand,
          carName,
          model,
          price,
          available,
          speed,
          transmission,
          fuel_type,
          description,
          images: newImages
        },
        { new: true } // Pour retourner l'objet mis à jour
      );
  
      res.status(200).json(updatedCar);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });  



// Suppression d'un service Car
router.delete('/delete/:id', async (req, res) => {
  try {
    // 🔹 Suppression de la voiture
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Voiture non trouvée' });
    }

    // 🔹 Suppression des réservations liées à cette voiture
    await Reservation.deleteMany({ type: 'car', item_id: req.params.id });

    res.status(200).json({ message: 'Voiture et ses réservations supprimées avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




// Route pour récupérer une voiture par son nom
router.get('/name/:carName', async (req, res) => {
  try {
    const car = await Car.findOne({ carName: req.params.carName });
    if (!car) {
      return res.status(404).json({ message: 'Voiture non trouvée' });
    }
    res.status(200).json(car);
  } catch (error) {
    console.error('Erreur lors de la recherche de la voiture :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Voiture non trouvée' });
    }
    res.json(car);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

export default router;