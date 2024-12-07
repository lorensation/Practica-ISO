// routes/userRoutes.js
const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const getIpMiddleware = require('../middleware/getIp');

const router = express.Router();

// Configuración de multer para subir imágenes de perfil
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Rutas de autenticación y perfil de usuario
router.post('/register', userController.register);
router.post('/login', getIpMiddleware, userController.login);
router.post('/logout', userController.logout);
router.get('/check-session', authController.checkSession);
router.get('/:username', authMiddleware, userController.getUserProfile);
router.put('/:username', authMiddleware, userController.updateUserProfile);
router.post('/uploads', authMiddleware, upload.single('fotoPerfil'), userController.uploadProfileImage);

router.post('/:username/predictions', authMiddleware, userController.addUserPrediction);
router.put('/:username/update-predictionPoints', authMiddleware, userController.updateUserPredictionsPoints);
router.get('/:username/predictions', authMiddleware, userController.getUserPredictions);
router.post('/:username/remove-prediction', authMiddleware, userController.deleteUserPrediction);
router.get('/predictionsRanking', userController.getPredictionsRanking)

router.put('/update-points/:username', authMiddleware, userController.updateUserPoints); // Actualizar puntos
router.get('/ranking', userController.getRanking); // Obtener ranking

router.put('/:username/score', userController.updateUserScore);

router.post('/help', userController.sendHelpRequest);

module.exports = router;
