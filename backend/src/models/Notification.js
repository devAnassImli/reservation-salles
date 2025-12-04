const pool = require("../config/db");

class Notification {
  // Créer une notification
  static async create(userId, title, message, type = "info", link = null) {
    const result = await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, link) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, title, message, type, link]
    );
    return result.rows[0];
  }

  // Récupérer les notifications d'un utilisateur
  static async findByUser(userId, limit = 20) {
    const result = await pool.query(
      `
            SELECT * FROM notifications 
            WHERE user_id = $1 
            ORDER BY created_at DESC 
            LIMIT $2
        `,
      [userId, limit]
    );
    return result.rows;
  }

  // Récupérer les notifications non lues
  static async findUnreadByUser(userId) {
    const result = await pool.query(
      `
            SELECT * FROM notifications 
            WHERE user_id = $1 AND is_read = false 
            ORDER BY created_at DESC
        `,
      [userId]
    );
    return result.rows;
  }

  // Compter les notifications non lues
  static async countUnread(userId) {
    const result = await pool.query(
      "SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false",
      [userId]
    );
    return parseInt(result.rows[0].count);
  }

  // Marquer une notification comme lue
  static async markAsRead(id) {
    const result = await pool.query(
      "UPDATE notifications SET is_read = true WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  // Marquer toutes les notifications comme lues
  static async markAllAsRead(userId) {
    await pool.query(
      "UPDATE notifications SET is_read = true WHERE user_id = $1",
      [userId]
    );
  }

  // Supprimer une notification
  static async delete(id) {
    const result = await pool.query(
      "DELETE FROM notifications WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  // Supprimer les anciennes notifications (plus de 30 jours)
  static async deleteOld() {
    const result = await pool.query(
      "DELETE FROM notifications WHERE created_at < NOW() - INTERVAL '30 days' RETURNING *"
    );
    return result.rows.length;
  }
}

module.exports = Notification;
