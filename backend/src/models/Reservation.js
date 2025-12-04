const pool = require("../config/db");

class Reservation {
  // Créer une réservation
  static async create(
    userId,
    roomId,
    startTime,
    endTime,
    title,
    description = null,
    attendeesCount = 1
  ) {
    const result = await pool.query(
      `INSERT INTO reservations (user_id, room_id, start_time, end_time, title, description, attendees_count) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, roomId, startTime, endTime, title, description, attendeesCount]
    );
    return result.rows[0];
  }

  // Vérifier les conflits de réservation
  static async checkConflict(roomId, startTime, endTime, excludeId = null) {
    let query = `
            SELECT * FROM reservations 
            WHERE room_id = $1 
            AND status != 'cancelled'
            AND (
                (start_time <= $2 AND end_time > $2) OR
                (start_time < $3 AND end_time >= $3) OR
                (start_time >= $2 AND end_time <= $3)
            )
        `;
    const params = [roomId, startTime, endTime];

    if (excludeId) {
      query += " AND id != $4";
      params.push(excludeId);
    }

    const result = await pool.query(query, params);
    return result.rows.length > 0;
  }

  // Récupérer toutes les réservations avec les infos salles et utilisateurs
  static async findAll() {
    const result = await pool.query(`
            SELECT r.*, 
                   rm.name as room_name, rm.capacity as room_capacity,
                   u.name as user_name, u.email as user_email
            FROM reservations r
            JOIN rooms rm ON r.room_id = rm.id
            JOIN users u ON r.user_id = u.id
            WHERE r.status != 'cancelled'
            ORDER BY r.start_time DESC
        `);
    return result.rows;
  }

  // Récupérer les réservations d'une salle
  static async findByRoom(roomId) {
    const result = await pool.query(
      `
            SELECT r.*, u.name as user_name
            FROM reservations r
            JOIN users u ON r.user_id = u.id
            WHERE r.room_id = $1 AND r.status != 'cancelled'
            ORDER BY r.start_time ASC
        `,
      [roomId]
    );
    return result.rows;
  }

  // Récupérer les réservations d'un utilisateur
  static async findByUser(userId) {
    const result = await pool.query(
      `
            SELECT r.*, rm.name as room_name, rm.capacity as room_capacity
            FROM reservations r
            JOIN rooms rm ON r.room_id = rm.id
            WHERE r.user_id = $1 AND r.status != 'cancelled'
            ORDER BY r.start_time DESC
        `,
      [userId]
    );
    return result.rows;
  }

  // Trouver une réservation par ID
  static async findById(id) {
    const result = await pool.query(
      `
            SELECT r.*, 
                   rm.name as room_name, rm.capacity as room_capacity,
                   u.name as user_name, u.email as user_email
            FROM reservations r
            JOIN rooms rm ON r.room_id = rm.id
            JOIN users u ON r.user_id = u.id
            WHERE r.id = $1
        `,
      [id]
    );
    return result.rows[0];
  }

  // Mettre à jour le statut d'une réservation
  static async updateStatus(id, status) {
    const result = await pool.query(
      `UPDATE reservations 
             SET status = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  }

  // Supprimer (annuler) une réservation
  static async delete(id) {
    const result = await pool.query(
      `UPDATE reservations 
             SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
             WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  // Compter les réservations
  static async count() {
    const result = await pool.query(
      "SELECT COUNT(*) FROM reservations WHERE status != 'cancelled'"
    );
    return parseInt(result.rows[0].count);
  }

  // Réservations d'aujourd'hui
  static async findToday() {
    const result = await pool.query(`
            SELECT r.*, 
                   rm.name as room_name,
                   u.name as user_name
            FROM reservations r
            JOIN rooms rm ON r.room_id = rm.id
            JOIN users u ON r.user_id = u.id
            WHERE DATE(r.start_time) = CURRENT_DATE
            AND r.status != 'cancelled'
            ORDER BY r.start_time ASC
        `);
    return result.rows;
  }
}

module.exports = Reservation;
