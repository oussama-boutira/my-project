import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Obtenir le chemin du fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dossier de destination pour Apartements
const folder = path.join(__dirname, '../../../IMAGES/Apartements');

// Créer le dossier s’il n’existe pas
if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
}

// Configuration du stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname;
        const filePath = path.join(folder, originalName);
    
        // Si le fichier existe, on ne le réécrit pas, mais on "accepte"
        if (fs.existsSync(filePath)) {
            console.log(`Le fichier ${originalName} existe déjà, il ne sera pas copié.`);
            return cb(null, originalName);  // On continue avec le même nom, mais Multer ne réécrit pas
        }
    
        cb(null, originalName);
    }
    
});

// Filtrer les types autorisés
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Seuls les fichiers image sont autorisés'), false);
    }
};

// Exporter le middleware Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { files: 3 }
});

export default upload;
