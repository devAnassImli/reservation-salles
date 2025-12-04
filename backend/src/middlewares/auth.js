const jwt = require("jsonwebtoken");
const { securityLogger } = require("../config/logger");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const ip = req.ip || req.connection.remoteAddress;

  if (!authHeader) {
    securityLogger.unauthorizedAccess(ip, req.originalUrl, "Token manquant");
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    securityLogger.unauthorizedAccess(ip, req.originalUrl, "Token invalide");
    return res.status(401).json({ message: "Token invalide" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    securityLogger.unauthorizedAccess(
      ip,
      req.originalUrl,
      "Token expiré ou invalide"
    );
    return res.status(401).json({ message: "Token expiré ou invalide" });
  }
};

const adminMiddleware = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;

  if (req.user.role !== "admin") {
    securityLogger.unauthorizedAccess(
      ip,
      req.originalUrl,
      "Accès admin refusé"
    );
    return res
      .status(403)
      .json({ message: "Accès réservé aux administrateurs" });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
