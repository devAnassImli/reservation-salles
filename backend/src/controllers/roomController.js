const Room = require('../models/Room');

const roomController = {
    // Créer une salle (admin uniquement)
    async create(req, res) {
        try {
            const { name, capacity, equipment } = req.body;

            if (!name || !capacity) {
                return res.status(400).json({ message: 'Le nom et la capacité sont requis' });
            }

            const room = await Room.create(name, capacity, equipment);
            res.status(201).json({
                message: 'Salle créée avec succès',
                room
            });
        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur', error: error.message });
        }
    },

    // Récupérer toutes les salles
    async getAll(req, res) {
        try {
            const rooms = await Room.findAll();
            res.json(rooms);
        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur', error: error.message });
        }
    },

    // Récupérer une salle par ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const room = await Room.findById(id);

            if (!room) {
                return res.status(404).json({ message: 'Salle non trouvée' });
            }

            res.json(room);
        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur', error: error.message });
        }
    },

    // Mettre à jour une salle (admin uniquement)
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, capacity, equipment } = req.body;

            const room = await Room.update(id, name, capacity, equipment);

            if (!room) {
                return res.status(404).json({ message: 'Salle non trouvée' });
            }

            res.json({
                message: 'Salle mise à jour avec succès',
                room
            });
        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur', error: error.message });
        }
    },

    // Supprimer une salle (admin uniquement)
    async delete(req, res) {
        try {
            const { id } = req.params;
            const room = await Room.delete(id);

            if (!room) {
                return res.status(404).json({ message: 'Salle non trouvée' });
            }

            res.json({ message: 'Salle supprimée avec succès' });
        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur', error: error.message });
        }
    }
};

module.exports = roomController;