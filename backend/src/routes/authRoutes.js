const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth');

// Inscription
router.post('/register', authController.register);

// Connexion
router.post('/login', authController.login);

// Récupérer le profil (authentifié)
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;