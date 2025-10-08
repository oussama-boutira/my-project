import express from 'express';
import Responsable from '../models/AdminDB.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Route pour récupérer l'utilisateur (si nécessaire)
// Route pour récupérer un seul admin par ID
router.get('/show/:id', async (req, res) => {
  try {
    const admin = await Responsable.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin non trouvé" });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// Route pour mettre à jour le profil
// Route pour mettre à jour le profil
router.put('/update/:id', async (req, res) => {
    const { name, email, password, newPassword } = req.body;
    const { id } = req.params;  // Récupérer l'ID de l'utilisateur depuis les paramètres
  
    try {
      // Trouver l'utilisateur par son ID
      const admin = await Responsable.findById(id);
  
      if (!admin) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      // Vérification du mot de passe actuel
      if (password) {
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
        }
      }
  
      // Mise à jour des informations
      admin.name = name || admin.name;
      admin.email = email || admin.email;
  
      // Mise à jour du mot de passe si un nouveau mot de passe est fourni
      if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
      }
  
      // Sauvegarder les modifications
      await admin.save();
  
      // Retourner les données mises à jour
      res.status(200).json(admin);
  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });  

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Trouver l'admin par son email
      const admin = await Responsable.findOne({ email });
      if (!admin) {
        return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
      }
  
      // Vérifier si le mot de passe correspond
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
      }
  
      // Si tout est bon, répondre avec l'admin (ou un token si nécessaire)
      res.status(200).json(admin);
  
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

export default router;
