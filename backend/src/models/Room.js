const pool = require("../config/db");

class Room {
  // Créer une nouvelle salle
  // Créer une nouvelle salle
  static async create(
    name,
    capacity,
    equipment,
    roomTypeId = null,
    floor = 0,
    building = null
  ) {
    const result = await pool.query(
      `INSERT INTO rooms (name, capacity, description, room_type_id, floor, building) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, capacity, equipment, roomTypeId, floor, building]
    );
    return result.rows[0];
  }

  // Récupérer toutes les salles avec leurs types
  // Récupérer toutes les salles avec leurs types
  static async findAll() {
    const result = await pool.query(`
            SELECT r.id, r.name, r.capacity, r.description as equipment, r.floor, r.building, 
                   r.room_type_id, r.is_active, r.image_url, r.created_at,
                   rt.name as type_name, rt.color as type_color
            FROM rooms r
            LEFT JOIN room_types rt ON r.room_type_id = rt.id
            WHERE r.is_active = true
            ORDER BY r.name ASC
        `);
    return result.rows;
  }

  // Trouver une salle par ID avec ses équipements
  static async findById(id) {
    const roomResult = await pool.query(
      `
            SELECT r.*, rt.name as type_name, rt.color as type_color
            FROM rooms r
            LEFT JOIN room_types rt ON r.room_type_id = rt.id
            WHERE r.id = $1
        `,
      [id]
    );

    if (roomResult.rows.length === 0) return null;

    const room = roomResult.rows[0];

    // Récupérer les équipements de la salle
    const equipmentsResult = await pool.query(
      `
            SELECT e.*, re.quantity
            FROM equipments e
            JOIN room_equipments re ON e.id = re.equipment_id
            WHERE re.room_id = $1
        `,
      [id]
    );

    room.equipments = equipmentsResult.rows;
    return room;
  }

  // Mettre à jour une salle
  static async update(id, name, capacity, equipment, roomTypeId = null) {
    const result = await pool.query(
      `UPDATE rooms 
             SET name = $1, capacity = $2, description = $3, room_type_id = $4, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $5 RETURNING *`,
      [name, capacity, equipment, roomTypeId, id]
    );
    return result.rows[0];
  }

  // Supprimer une salle (soft delete)
  static async delete(id) {
    const result = await pool.query(
      "UPDATE rooms SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  // Récupérer tous les types de salles
  static async getAllTypes() {
    const result = await pool.query(
      "SELECT * FROM room_types ORDER BY name ASC"
    );
    return result.rows;
  }

  // Récupérer tous les équipements
  static async getAllEquipments() {
    const result = await pool.query(
      "SELECT * FROM equipments ORDER BY name ASC"
    );
    return result.rows;
  }

  // Ajouter un équipement à une salle
  static async addEquipment(roomId, equipmentId, quantity = 1) {
    const result = await pool.query(
      `INSERT INTO room_equipments (room_id, equipment_id, quantity) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (room_id, equipment_id) DO UPDATE SET quantity = $3
             RETURNING *`,
      [roomId, equipmentId, quantity]
    );
    return result.rows[0];
  }

  // Supprimer un équipement d'une salle
  static async removeEquipment(roomId, equipmentId) {
    const result = await pool.query(
      "DELETE FROM room_equipments WHERE room_id = $1 AND equipment_id = $2 RETURNING *",
      [roomId, equipmentId]
    );
    return result.rows[0];
  }
}

module.exports = Room;
