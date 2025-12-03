const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "reservation_salles",
});

pool.on("connect", () => {
  console.log("Connecté à la base de données PostgreSQL");
});

pool.on("error", (err) => {
  console.error("Erreur de connexion à la base de données:", err);
});

module.exports = pool;
