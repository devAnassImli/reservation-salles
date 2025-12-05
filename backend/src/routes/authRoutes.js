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
// Mettre à jour le profil
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, phone, departmentId } = req.body;
    const User = require("../models/User");
    const user = await User.update(req.user.id, { name, phone, departmentId });
    res.json({ message: "Profil mis à jour", user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Changer le mot de passe
router.put("/password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const User = require("../models/User");
    const bcrypt = require("bcryptjs");
    const pool = require("../config/db");

    // Récupérer l'utilisateur avec le mot de passe
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.user.id,
    ]);
    const user = result.rows[0];

    // Vérifier le mot de passe actuel
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Mot de passe actuel incorrect" });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour
    await pool.query(
      "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [hashedPassword, req.user.id]
    );

    res.json({ message: "Mot de passe modifié avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});
module.exports = router;
