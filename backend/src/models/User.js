const pool = require("../config/db");
const bcrypt = require("bcryptjs");

class User {
  // Créer un nouvel utilisateur
  static async create(name, email, password, role = "employee") {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at",
      [name, email, hashedPassword, role]
    );
    return result.rows[0];
  }

  // Trouver un utilisateur par email
  static async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  }

  // Trouver un utilisateur par ID
  static async findById(id) {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }

  // Récupérer tous les utilisateurs
  static async findAll() {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    return result.rows;
  }

  // Vérifier le mot de passe
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
