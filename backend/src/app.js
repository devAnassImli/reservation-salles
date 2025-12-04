const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const auditRoutes = require("./routes/auditRoutes");

const app = express();

// Sécurité : Headers HTTP
app.use(helmet());

// Sécurité : Rate limiting (1000 requêtes par 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { message: "Trop de requêtes, veuillez réessayer plus tard." },
});
app.use(limiter);

// Rate limiting strict pour l'authentification (20 tentatives par 15 min)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    message: "Trop de tentatives de connexion, veuillez réessayer plus tard.",
  },
});
// Middlewares
app.use(cors());
app.use(express.json({ limit: "10kb" })); // Limite la taille des requêtes

// Route de test
app.get("/", (req, res) => {
  res.json({ message: "API Réservation de Salles fonctionne !" });
});

// Routes avec rate limiting sur auth
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/audit", auditRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur serveur interne" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;
