const pool = require("../config/db");

class AuditLog {
  // Créer un log d'audit
  static async create(
    userId,
    action,
    entityType,
    entityId,
    oldValues = null,
    newValues = null,
    ipAddress = null,
    userAgent = null
  ) {
    const result = await pool.query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        userId,
        action,
        entityType,
        entityId,
        JSON.stringify(oldValues),
        JSON.stringify(newValues),
        ipAddress,
        userAgent,
      ]
    );
    return result.rows[0];
  }

  // Récupérer tous les logs avec pagination
  static async findAll(limit = 50, offset = 0) {
    const result = await pool.query(
      `
            SELECT al.*, u.name as user_name, u.email as user_email
            FROM audit_logs al
            LEFT JOIN users u ON al.user_id = u.id
            ORDER BY al.created_at DESC
            LIMIT $1 OFFSET $2
        `,
      [limit, offset]
    );
    return result.rows;
  }

  // Récupérer les logs d'un utilisateur
  static async findByUser(userId, limit = 50) {
    const result = await pool.query(
      `
            SELECT * FROM audit_logs 
            WHERE user_id = $1 
            ORDER BY created_at DESC 
            LIMIT $2
        `,
      [userId, limit]
    );
    return result.rows;
  }

  // Récupérer les logs d'une entité
  static async findByEntity(entityType, entityId) {
    const result = await pool.query(
      `
            SELECT al.*, u.name as user_name
            FROM audit_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE al.entity_type = $1 AND al.entity_id = $2
            ORDER BY al.created_at DESC
        `,
      [entityType, entityId]
    );
    return result.rows;
  }

  // Récupérer les logs par action
  static async findByAction(action, limit = 50) {
    const result = await pool.query(
      `
            SELECT al.*, u.name as user_name
            FROM audit_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE al.action = $1
            ORDER BY al.created_at DESC
            LIMIT $2
        `,
      [action, limit]
    );
    return result.rows;
  }

  // Compter les logs
  static async count() {
    const result = await pool.query("SELECT COUNT(*) FROM audit_logs");
    return parseInt(result.rows[0].count);
  }

  // Supprimer les anciens logs (plus de 90 jours)
  static async deleteOld() {
    const result = await pool.query(
      "DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '90 days' RETURNING *"
    );
    return result.rows.length;
  }

  // Actions courantes pour faciliter l'utilisation
  static async logLogin(userId, ipAddress, userAgent) {
    return this.create(
      userId,
      "LOGIN",
      "user",
      userId,
      null,
      null,
      ipAddress,
      userAgent
    );
  }

  static async logLogout(userId, ipAddress) {
    return this.create(userId, "LOGOUT", "user", userId, null, null, ipAddress);
  }

  static async logCreate(userId, entityType, entityId, newValues, ipAddress) {
    return this.create(
      userId,
      "CREATE",
      entityType,
      entityId,
      null,
      newValues,
      ipAddress
    );
  }

  static async logUpdate(
    userId,
    entityType,
    entityId,
    oldValues,
    newValues,
    ipAddress
  ) {
    return this.create(
      userId,
      "UPDATE",
      entityType,
      entityId,
      oldValues,
      newValues,
      ipAddress
    );
  }

  static async logDelete(userId, entityType, entityId, oldValues, ipAddress) {
    return this.create(
      userId,
      "DELETE",
      entityType,
      entityId,
      oldValues,
      null,
      ipAddress
    );
  }
}

module.exports = AuditLog;
