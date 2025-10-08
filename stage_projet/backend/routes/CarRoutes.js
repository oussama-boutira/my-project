import express from 'express';
import Car from '../models/CarDB.js'

const router = express.Router();

router.get('/show', async(req, res) => {
    try{
        const car = await Car.find()
        res.status(200).json(car)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

export default router;