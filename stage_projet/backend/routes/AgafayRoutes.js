import express from 'express';
import AgafayService from '../models/AgafayDB.js';

const router = express.Router();

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
router.post('/create', async (req, res) => {
    const { name, duration, description, price, images, available } = req.body;

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
router.put('/update/:id', async (req, res) => {
    try {
        const updatedAgafay = await AgafayService.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Renvoie l'objet mis à jour
        );
        if (!updatedAgafay) {
            return res.status(404).json({ message: 'Service Agafay non trouvé' });
        }
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
        res.status(200).json({ message: 'Service Agafay supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Recherche d'un service Agafay par son nom
router.get('/search', async (req, res) => {
    const { name } = req.query;
    try {
        const agafay = await AgafayService.find({ name: new RegExp(name, 'i') }); // Recherche insensible à la casse
        if (agafay.length === 0) {
            return res.status(404).json({ message: 'Aucun service Agafay trouvé' });
        }
        res.status(200).json(agafay);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
