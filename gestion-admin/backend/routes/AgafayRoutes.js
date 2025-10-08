import express from 'express';
import AgafayService from '../models/AgafayDB.js';
import Reservation from '../models/ReservationDB.js';
import upload from '../middlewares/AgafayUpload.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Afficher tous les services Agafay
router.get('/show', async (req, res) => {
    try {
        const agafay = await AgafayService.find();
        res.status(200).json(agafay);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Création d'un service Agafay
router.post('/create', upload.array('images', 3), async (req, res) => {
    const { name, duration, description, price, available } = req.body;

    const images = req.files.map(file => {
        const filePath = path.join(__dirname, '../../../IMAGES/Agafay', file.filename);
      if (!fs.existsSync(filePath)) {
          console.log(`⚠️ Le fichier ${file.filename} n'a pas été enregistré physiquement (il existait déjà).`);
      }

      return `/Images/Agafay/${file.filename}`;
    });

    const agafayService = new AgafayService({
        name,
        duration,
        description,
        price,
        images,
        available
    });

    try {
        const newAgafayService = await agafayService.save();
        res.status(201).json(newAgafayService);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Modification d'un service Agafay
router.put('/update/:id', upload.array('images', 3), async (req, res) => {
    const { name, duration, description, price, available } = req.body;

    try {
        const oldService = await AgafayService.findById(req.params.id);
        if (!oldService) {
            return res.status(404).json({ message: 'Service Agafay non trouvé' });
        }

        // Anciennes images
        let oldImages = oldService.images || [];

        // Fusion : remplacer seulement là où il y a des fichiers
        let newImages = [...oldImages]; // commencer avec les anciennes

        req.files.forEach((file, index) => {
            const imagePath = `/Images/Agafay/${file.filename}`;
            newImages[index] = imagePath; // remplace à l’index correspondant
        });

        const updatedAgafay = await AgafayService.findByIdAndUpdate(
            req.params.id,
            {
                name,
                duration,
                description,
                price,
                available,
                images: newImages
            },
            { new: true }
        );

        res.status(200).json(updatedAgafay);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Suppression d'un service Agafay
router.delete('/delete/:id', async (req, res) => {
    try {
        const agafay = await AgafayService.findByIdAndDelete(req.params.id);
        if (!agafay) {
            return res.status(404).json({ message: 'Service Agafay non trouvé' });
        }
        await Reservation.deleteMany({ type: 'service', item_id: req.params.id });

        res.status(200).json({ message: 'Service Agafay et ses reservations supprimées avec succès' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




router.get('/name/:name', async (req, res) => {
  try {
    const agafay = await AgafayService.findOne({ name: req.params.name });
    if (!agafay) {
      return res.status(404).json({ message: 'le service non trouvée' });
    }
    res.status(200).json(agafay);
  } catch (error) {
    console.error('Erreur lors de la recherche de service :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const agafay = await AgafayService.findById(req.params.id);
    if (!agafay) {
      return res.status(404).json({ message: 'le service non trouvée' });
    }
    res.json(agafay);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

export default router;