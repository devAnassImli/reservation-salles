const pool = require("../config/db");

class Room {
  // Créer une nouvelle salle
  static async create(name, capacity, equipment) {
    const result = await pool.query(
      "INSERT INTO rooms (name, capacity, equipment) VALUES ($1, $2, $3) RETURNING *",
      [name, capacity, equipment]
    );
    return result.rows[0];
  }

  // Récupérer toutes les salles
  static async findAll() {
    const result = await pool.query("SELECT * FROM rooms ORDER BY name ASC");
    return result.rows;
  }

  // Trouver une salle par ID
  static async findById(id) {
    const result = await pool.query("SELECT * FROM rooms WHERE id = $1", [id]);
    return result.rows[0];
  }

  // Mettre à jour une salle
  static async update(id, name, capacity, equipment) {
    const result = await pool.query(
      "UPDATE rooms SET name = $1, capacity = $2, equipment = $3 WHERE id = $4 RETURNING *",
      [name, capacity, equipment, id]
    );
    return result.rows[0];
  }

  // Supprimer une salle
  static async delete(id) {
    const result = await pool.query(
      "DELETE FROM rooms WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Room;
