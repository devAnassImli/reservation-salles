const Reservation = require("../models/Reservation");
const Room = require("../models/Room");

const reservationController = {
  // Créer une réservation
  async create(req, res) {
    try {
      const { roomId, startTime, endTime, title } = req.body;
      const userId = req.user.id;

      // Vérifier que la salle existe
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: "Salle non trouvée" });
      }

      // Vérifier les conflits
      const hasConflict = await Reservation.checkConflict(
        roomId,
        startTime,
        endTime
      );
      if (hasConflict) {
        return res
          .status(409)
          .json({ message: "Cette salle est déjà réservée sur ce créneau" });
      }

      const reservation = await Reservation.create(
        userId,
        roomId,
        startTime,
        endTime,
        title
      );
      res.status(201).json({
        message: "Réservation créée avec succès",
        reservation,
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Récupérer toutes les réservations
  async getAll(req, res) {
    try {
      const reservations = await Reservation.findAll();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Récupérer les réservations d'une salle
  async getByRoom(req, res) {
    try {
      const { roomId } = req.params;
      const reservations = await Reservation.findByRoom(roomId);
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Récupérer mes réservations
  async getMyReservations(req, res) {
    try {
      const userId = req.user.id;
      const reservations = await Reservation.findByUser(userId);
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Supprimer une réservation
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Vérifier que la réservation existe
      const reservation = await Reservation.findById(id);
      if (!reservation) {
        return res.status(404).json({ message: "Réservation non trouvée" });
      }

      // Vérifier les droits (propriétaire ou admin)
      if (reservation.user_id !== userId && userRole !== "admin") {
        return res
          .status(403)
          .json({ message: "Vous ne pouvez pas supprimer cette réservation" });
      }

      await Reservation.delete(id);
      res.json({ message: "Réservation supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },
};

module.exports = reservationController;
