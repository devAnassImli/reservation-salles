const Room = require("../models/Room");
const AuditLog = require("../models/AuditLog");
const { securityLogger } = require("../config/logger");

const roomController = {
  // Créer une salle (admin uniquement)
  async create(req, res) {
    try {
      const { name, capacity, equipment, roomTypeId, floor, building } =
        req.body;
      const ip = req.ip || req.connection.remoteAddress;

      if (!name || !capacity) {
        return res
          .status(400)
          .json({ message: "Le nom et la capacité sont requis" });
      }

      const room = await Room.create(
        name,
        capacity,
        equipment,
        roomTypeId,
        floor,
        building
      );

      // Log d'audit
      await AuditLog.logCreate(
        req.user.id,
        "room",
        room.id,
        { name, capacity },
        ip
      );
      securityLogger.adminAction(req.user.id, "CREATE_ROOM", {
        roomId: room.id,
        name,
      });

      res.status(201).json({
        message: "Salle créée avec succès",
        room,
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Récupérer toutes les salles
  async getAll(req, res) {
    try {
      const rooms = await Room.findAll();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Récupérer une salle par ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const room = await Room.findById(id);

      if (!room) {
        return res.status(404).json({ message: "Salle non trouvée" });
      }

      res.json(room);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Mettre à jour une salle (admin uniquement)
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, capacity, equipment, roomTypeId } = req.body;
      const ip = req.ip || req.connection.remoteAddress;

      const oldRoom = await Room.findById(id);
      if (!oldRoom) {
        return res.status(404).json({ message: "Salle non trouvée" });
      }

      const room = await Room.update(id, name, capacity, equipment, roomTypeId);

      // Log d'audit
      await AuditLog.logUpdate(
        req.user.id,
        "room",
        id,
        { name: oldRoom.name, capacity: oldRoom.capacity },
        { name, capacity },
        ip
      );
      securityLogger.adminAction(req.user.id, "UPDATE_ROOM", {
        roomId: id,
        name,
      });

      res.json({
        message: "Salle mise à jour avec succès",
        room,
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Supprimer une salle (admin uniquement)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const ip = req.ip || req.connection.remoteAddress;

      const oldRoom = await Room.findById(id);
      if (!oldRoom) {
        return res.status(404).json({ message: "Salle non trouvée" });
      }

      const room = await Room.delete(id);

      // Log d'audit
      await AuditLog.logDelete(
        req.user.id,
        "room",
        id,
        { name: oldRoom.name },
        ip
      );
      securityLogger.adminAction(req.user.id, "DELETE_ROOM", { roomId: id });

      res.json({ message: "Salle supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Récupérer les types de salles
  async getTypes(req, res) {
    try {
      const types = await Room.getAllTypes();
      res.json(types);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Récupérer les équipements
  async getEquipments(req, res) {
    try {
      const equipments = await Room.getAllEquipments();
      res.json(equipments);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Ajouter un équipement à une salle
  async addEquipment(req, res) {
    try {
      const { id } = req.params;
      const { equipmentId, quantity } = req.body;

      const result = await Room.addEquipment(id, equipmentId, quantity);

      res.json({
        message: "Équipement ajouté avec succès",
        result,
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Supprimer un équipement d'une salle
  async removeEquipment(req, res) {
    try {
      const { id, equipmentId } = req.params;

      await Room.removeEquipment(id, equipmentId);

      res.json({ message: "Équipement retiré avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },
};

module.exports = roomController;
