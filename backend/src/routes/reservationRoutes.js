const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const { authMiddleware } = require("../middlewares/auth");
const { validateReservation } = require("../middlewares/validator");

// Récupérer toutes les réservations (authentifié)
router.get("/", authMiddleware, reservationController.getAll);

// Récupérer mes réservations (authentifié)
router.get("/my", authMiddleware, reservationController.getMyReservations);

// Récupérer les réservations d'une salle (authentifié)
router.get("/room/:roomId", authMiddleware, reservationController.getByRoom);

// Créer une réservation (authentifié)
router.post(
  "/",
  authMiddleware,
  validateReservation,
  reservationController.create
);

// Supprimer une réservation (authentifié)
router.delete("/:id", authMiddleware, reservationController.delete);

module.exports = router;
