const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { securityLogger } = require("../config/logger");
require("dotenv").config();

const authController = {
  // Inscription
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;
      const ip = req.ip || req.connection.remoteAddress;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        securityLogger.loginFailed(email, ip, "Email déjà utilisé");
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }

      // Créer l'utilisateur
      const user = await User.create(name, email, password, role);

      // Générer le token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      securityLogger.registerSuccess(email, ip);

      res.status(201).json({
        message: "Utilisateur créé avec succès",
        user,
        token,
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Connexion
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const ip = req.ip || req.connection.remoteAddress;

      // Trouver l'utilisateur
      const user = await User.findByEmail(email);
      if (!user) {
        securityLogger.loginFailed(email, ip, "Utilisateur non trouvé");
        return res
          .status(401)
          .json({ message: "Email ou mot de passe incorrect" });
      }

      // Vérifier le mot de passe
      const isValidPassword = await User.verifyPassword(
        password,
        user.password
      );
      if (!isValidPassword) {
        securityLogger.loginFailed(email, ip, "Mot de passe incorrect");
        return res
          .status(401)
          .json({ message: "Email ou mot de passe incorrect" });
      }

      // Générer le token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      securityLogger.loginSuccess(email, ip);

      res.json({
        message: "Connexion réussie",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Récupérer le profil
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },
};

module.exports = authController;
