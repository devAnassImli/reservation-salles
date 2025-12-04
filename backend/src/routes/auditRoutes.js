const express = require("express");
const router = express.Router();
const AuditLog = require("../models/AuditLog");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth");

// Récupérer tous les logs (admin uniquement)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const logs = await AuditLog.findAll(limit, offset);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Récupérer les logs d'un utilisateur (admin uniquement)
router.get(
  "/user/:userId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const logs = await AuditLog.findByUser(req.params.userId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  }
);

// Récupérer les logs d'une entité (admin uniquement)
router.get(
  "/entity/:type/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const logs = await AuditLog.findByEntity(req.params.type, req.params.id);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  }
);

// Récupérer les logs par action (admin uniquement)
router.get(
  "/action/:action",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const logs = await AuditLog.findByAction(req.params.action);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  }
);

// Compter les logs (admin uniquement)
router.get("/count", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const count = await AuditLog.count();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;
