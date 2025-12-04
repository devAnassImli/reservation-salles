const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { authMiddleware } = require("../middlewares/auth");

// Récupérer mes notifications
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.findByUser(req.user.id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Compter les notifications non lues
router.get("/unread/count", authMiddleware, async (req, res) => {
  try {
    const count = await Notification.countUnread(req.user.id);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Marquer une notification comme lue
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.markAsRead(req.params.id);
    res.json({ message: "Notification marquée comme lue", notification });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Marquer toutes les notifications comme lues
router.put("/read-all", authMiddleware, async (req, res) => {
  try {
    await Notification.markAllAsRead(req.user.id);
    res.json({ message: "Toutes les notifications marquées comme lues" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Supprimer une notification
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Notification.delete(req.params.id);
    res.json({ message: "Notification supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;
