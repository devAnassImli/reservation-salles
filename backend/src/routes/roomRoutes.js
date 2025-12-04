const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth");
const { validateRoom } = require("../middlewares/validator");

// Récupérer toutes les salles (authentifié)
router.get("/", authMiddleware, roomController.getAll);

// Récupérer une salle par ID (authentifié)
router.get("/:id", authMiddleware, roomController.getById);

// Créer une salle (admin uniquement)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateRoom,
  roomController.create
);

// Mettre à jour une salle (admin uniquement)
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateRoom,
  roomController.update
);

// Supprimer une salle (admin uniquement)
router.delete("/:id", authMiddleware, adminMiddleware, roomController.delete);

module.exports = router;
