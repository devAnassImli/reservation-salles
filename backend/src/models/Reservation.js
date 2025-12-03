const pool = require("../config/db");

class Reservation {
  // Créer une nouvelle réservation
  static async create(userId, roomId, startTime, endTime, title) {
    const result = await pool.query(
      "INSERT INTO reservations (user_id, room_id, start_time, end_time, title) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [userId, roomId, startTime, endTime, title]
    );
    return result.rows[0];
  }

  // Vérifier les conflits de réservation
  static async checkConflict(roomId, startTime, endTime, excludeId = null) {
    let query = `
            SELECT * FROM reservations 
            WHERE room_id = $1 
            AND (
                (start_time < $3 AND end_time > $2)
            )
        `;
    let params = [roomId, startTime, endTime];

    if (excludeId) {
      query += " AND id != $4";
      params.push(excludeId);
    }

    const result = await pool.query(query, params);
    return result.rows.length > 0;
  }

  // Récupérer toutes les réservations
  static async findAll() {
    const result = await pool.query(`
            SELECT r.*, u.name as user_name, ro.name as room_name 
            FROM reservations r
            JOIN users u ON r.user_id = u.id
            JOIN rooms ro ON r.room_id = ro.id
            ORDER BY r.start_time ASC
        `);
    return result.rows;
  }

  // Récupérer les réservations par salle
  static async findByRoom(roomId) {
    const result = await pool.query(
      `
            SELECT r.*, u.name as user_name 
            FROM reservations r
            JOIN users u ON r.user_id = u.id
            WHERE r.room_id = $1
            ORDER BY r.start_time ASC
        `,
      [roomId]
    );
    return result.rows;
  }

  // Récupérer les réservations par utilisateur
  static async findByUser(userId) {
    const result = await pool.query(
      `
            SELECT r.*, ro.name as room_name 
            FROM reservations r
            JOIN rooms ro ON r.room_id = ro.id
            WHERE r.user_id = $1
            ORDER BY r.start_time ASC
        `,
      [userId]
    );
    return result.rows;
  }

  // Trouver une réservation par ID
  static async findById(id) {
    const result = await pool.query(
      "SELECT * FROM reservations WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }

  // Supprimer une réservation
  static async delete(id) {
    const result = await pool.query(
      "DELETE FROM reservations WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Reservation;
