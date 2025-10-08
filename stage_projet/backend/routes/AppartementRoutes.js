import express from 'express';
import Appartement from '../models/AppartementDB.js'

const router = express.Router();

router.get('/show', async(req, res) => {
    try{
        const appartement = await Appartement.find()
        res.status(200).json(appartement)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

export default router;