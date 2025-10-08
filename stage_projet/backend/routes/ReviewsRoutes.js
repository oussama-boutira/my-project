import express from 'express';

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

// Route pour créer une nouvelle review
router.post('/create', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const newReview = new Review({
            name,
            email,
            message,
        });

        await newReview.save();
        res.status(201).json({ message: 'Review créée avec succès!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
