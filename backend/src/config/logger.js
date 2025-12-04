const winston = require("winston");
const path = require("path");

// Format personnalisé pour les logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    return log;
  })
);

// Créer le logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  transports: [
    // Logs dans la console
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
    // Logs d'erreurs dans un fichier
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/error.log"),
      level: "error",
    }),
    // Tous les logs dans un fichier
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/combined.log"),
    }),
    // Logs de sécurité dans un fichier séparé
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/security.log"),
      level: "warn",
    }),
  ],
});

// Fonctions de log spécifiques à la sécurité
const securityLogger = {
  // Connexion réussie
  loginSuccess: (email, ip) => {
    logger.info("Connexion réussie", {
      type: "AUTH",
      action: "LOGIN_SUCCESS",
      email,
      ip,
    });
  },

  // Connexion échouée
  loginFailed: (email, ip, reason) => {
    logger.warn("Tentative de connexion échouée", {
      type: "SECURITY",
      action: "LOGIN_FAILED",
      email,
      ip,
      reason,
    });
  },

  // Inscription
  registerSuccess: (email, ip) => {
    logger.info("Inscription réussie", {
      type: "AUTH",
      action: "REGISTER_SUCCESS",
      email,
      ip,
    });
  },

  // Accès non autorisé
  unauthorizedAccess: (ip, route, reason) => {
    logger.warn("Accès non autorisé", {
      type: "SECURITY",
      action: "UNAUTHORIZED",
      ip,
      route,
      reason,
    });
  },

  // Rate limit atteint
  rateLimitExceeded: (ip, route) => {
    logger.warn("Rate limit dépassé", {
      type: "SECURITY",
      action: "RATE_LIMIT",
      ip,
      route,
    });
  },

  // Action admin
  adminAction: (userId, action, target) => {
    logger.info("Action administrateur", {
      type: "ADMIN",
      action,
      userId,
      target,
    });
  },

  // Erreur de validation
  validationError: (ip, route, errors) => {
    logger.warn("Erreur de validation", {
      type: "VALIDATION",
      ip,
      route,
      errors,
    });
  },

  // Réservation créée
  reservationCreated: (userId, roomId, startTime, endTime) => {
    logger.info("Réservation créée", {
      type: "BOOKING",
      action: "CREATE",
      userId,
      roomId,
      startTime,
      endTime,
    });
  },

  // Réservation supprimée
  reservationDeleted: (userId, reservationId) => {
    logger.info("Réservation supprimée", {
      type: "BOOKING",
      action: "DELETE",
      userId,
      reservationId,
    });
  },
};

module.exports = { logger, securityLogger };
