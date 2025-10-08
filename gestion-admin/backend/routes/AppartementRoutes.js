import express from 'express';
import Appartement from '../models/AppartementDB.js';
import Reservation from '../models/ReservationDB.js';
import upload from '../middlewares/AppartementUpload.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/show', async (req, res) => {
    try {
        const appartement = await Appartement.find();
        res.status(200).json(appartement);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Création d'un service appartement
router.post('/create', upload.array('images', 3), async (req, res) => {
    const { 
        name, 
        address, 
        description, 
        price, 
        bedrooms, 
        bathrooms, 
        balcony, 
        shower, 
        floor, 
        buildingType, 
        available 
    } = req.body;  // Récupération de toutes les valeurs du body

    // Récupération des images
    const images = req.files.map(file => {
        const filePath = path.join(__dirname, '../../../IMAGES/Apartements', file.filename);
      if (!fs.existsSync(filePath)) {
          console.log(`⚠️ Le fichier ${file.filename} n'a pas été enregistré physiquement (il existait déjà).`);
      }

      return `/Images/Apartements/${file.filename}`;
    });

    // Création du nouvel appartement
    const appartement = new Appartement({
        name,
        address,
        description,
        price,
        bedrooms,
        bathrooms,
        balcony: balcony === 'true',  // Assurez-vous de traiter le type de données
        shower: shower === 'true',  // idem
        floor,
        buildingType,
        images,
        available: available === 'true',  // Assurez-vous de convertir en booléen
    });

    try {
        // Sauvegarde dans la base de données
        const newAppartement = await appartement.save();
        res.status(201).json(newAppartement);
    } catch (err) {
        console.error(err);  // Affiche l'erreur dans la console
        res.status(400).json({ message: err.message });
    }
});




// Modification d'un service Appartement
router.put('/update/:id', upload.array('images', 3), async (req, res) => {
    const { 
        name, 
        address, 
        description, 
        price, 
        bedrooms, 
        bathrooms, 
        balcony, 
        shower, 
        floor, 
        buildingType, 
        available 
    } = req.body; 

    try {
        const oldAppartement = await Appartement.findById(req.params.id);
        if (!oldAppartement) {
            return res.status(404).json({ message: 'Appartement non trouvé' });
        }

        // Anciennes images
        let oldImages = oldAppartement.images || [];

        // Fusion des anciennes et nouvelles images
        let newImages = [...oldImages];

        req.files.forEach((file, index) => {
            const imagePath = `/Images/Apartements/${file.filename}`;
            newImages[index] = imagePath; // Remplace l'ancienne image à la même position
        });

        const updatedAppartement = await Appartement.findByIdAndUpdate(
            req.params.id,
            {
                name,
                address,
                description,
                price,
                bedrooms,
                bathrooms,
                balcony,
                shower,
                floor,
                buildingType,
                available,
                images: newImages
            },
            { new: true }
        );

        res.status(200).json(updatedAppartement);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Suppression d'un service Appartement
router.delete('/delete/:id', async (req, res) => {
    try {
        const appartement = await Appartement.findByIdAndDelete(req.params.id);
        if (!appartement) {
            return res.status(404).json({ message: 'Appartement non trouvé' });
        }
        await Reservation.deleteMany({ type: 'appartement', item_id: req.params.id });
        
        res.status(200).json({ message: 'Appartement et ses reservations supprimées avec succès' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




router.get('/name/:name', async (req, res) => {
  try {
    const appartement = await Appartement.findOne({ name: req.params.name });
    if (!appartement) {
      return res.status(404).json({ message: 'Appartement non trouvée' });
    }
    res.status(200).json(appartement);
  } catch (error) {
    console.error('Erreur lors de la recherche de la Appartement :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const appartement = await Appartement.findById(req.params.id);
    if (!appartement) {
      return res.status(404).json({ message: 'Appartement non trouvée' });
    }
    res.json(appartement);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

export default router;