const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth");

// Récupérer tous les utilisateurs (admin uniquement)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Récupérer un utilisateur par ID (admin uniquement)
router.get("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Mettre à jour un utilisateur (admin uniquement)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, phone, departmentId } = req.body;
    const user = await User.update(req.params.id, {
      name,
      phone,
      departmentId,
    });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({ message: "Utilisateur mis à jour", user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Récupérer les départements
router.get("/data/departments", authMiddleware, async (req, res) => {
  try {
    const departments = await User.getAllDepartments();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Compter les utilisateurs (admin uniquement)
router.get("/data/count", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const count = await User.count();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;
