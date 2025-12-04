const pool = require("../config/db");
const bcrypt = require("bcryptjs");

class User {
  // Créer un nouvel utilisateur
  static async create(
    name,
    email,
    password,
    role = "employee",
    departmentId = null
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, department_id) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id, name, email, role, department_id, created_at`,
      [name, email, hashedPassword, role, departmentId]
    );
    return result.rows[0];
  }

  // Trouver un utilisateur par email
  static async findByEmail(email) {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND is_active = true",
      [email]
    );
    return result.rows[0];
  }

  // Trouver un utilisateur par ID avec son département
  static async findById(id) {
    const result = await pool.query(
      `
            SELECT u.id, u.name, u.email, u.role, u.phone, u.avatar_url, u.created_at, u.last_login,
                   d.name as department_name
            FROM users u
            LEFT JOIN departments d ON u.department_id = d.id
            WHERE u.id = $1 AND u.is_active = true
        `,
      [id]
    );
    return result.rows[0];
  }

  // Récupérer tous les utilisateurs
  static async findAll() {
    const result = await pool.query(`
            SELECT u.id, u.name, u.email, u.role, u.phone, u.created_at, u.last_login, u.is_active,
                   d.name as department_name
            FROM users u
            LEFT JOIN departments d ON u.department_id = d.id
            ORDER BY u.created_at DESC
        `);
    return result.rows;
  }

  // Vérifier le mot de passe
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Mettre à jour le dernier login
  static async updateLastLogin(id) {
    await pool.query(
      "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1",
      [id]
    );
  }

  // Mettre à jour un utilisateur
  static async update(id, data) {
    const { name, phone, departmentId } = data;
    const result = await pool.query(
      `UPDATE users 
             SET name = COALESCE($1, name), 
                 phone = COALESCE($2, phone), 
                 department_id = COALESCE($3, department_id),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $4 
             RETURNING id, name, email, role, phone, department_id`,
      [name, phone, departmentId, id]
    );
    return result.rows[0];
  }

  // Récupérer tous les départements
  static async getAllDepartments() {
    const result = await pool.query(
      "SELECT * FROM departments ORDER BY name ASC"
    );
    return result.rows;
  }

  // Compter les utilisateurs
  static async count() {
    const result = await pool.query(
      "SELECT COUNT(*) FROM users WHERE is_active = true"
    );
    return parseInt(result.rows[0].count);
  }
}

module.exports = User;
