const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/auth");
const { validateRegister, validateLogin } = require("../middlewares/validator");

// Inscription
router.post("/register", validateRegister, authController.register);

// Connexion
router.post("/login", validateLogin, authController.login);

// Récupérer le profil (authentifié)
router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;
