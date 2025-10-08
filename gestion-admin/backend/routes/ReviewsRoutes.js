import express from 'express';
import { Types } from 'mongoose';

import Review from '../models/ReviewsDB.js';

const router = express.Router();

// Route pour récupérer toutes les reviews
router.get('/show', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Route pour supprimer une review par ID avec vérification ObjectId

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const review = await Review.findByIdAndDelete(id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


export default router;
