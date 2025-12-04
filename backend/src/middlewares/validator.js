const { body, validationResult } = require("express-validator");

// Gestion des erreurs de validation
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Données invalides",
      errors: errors.array(),
    });
  }
  next();
};

// Validation inscription
const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Le nom est requis")
    .isLength({ min: 2, max: 100 })
    .withMessage("Le nom doit contenir entre 2 et 100 caractères")
    .escape(),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("Email invalide")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Le mot de passe est requis")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
  body("role")
    .optional()
    .isIn(["admin", "employee"])
    .withMessage("Rôle invalide"),
  handleValidation,
];

// Validation connexion
const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("Email invalide")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Le mot de passe est requis"),
  handleValidation,
];

// Validation création salle
const validateRoom = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Le nom est requis")
    .isLength({ min: 2, max: 100 })
    .withMessage("Le nom doit contenir entre 2 et 100 caractères")
    .escape(),
  body("capacity")
    .notEmpty()
    .withMessage("La capacité est requise")
    .isInt({ min: 1, max: 1000 })
    .withMessage("La capacité doit être un nombre entre 1 et 1000"),
  body("equipment")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("L'équipement ne doit pas dépasser 500 caractères")
    .escape(),
  handleValidation,
];

// Validation création réservation
const validateReservation = [
  body("roomId")
    .notEmpty()
    .withMessage("La salle est requise")
    .isInt({ min: 1 })
    .withMessage("ID de salle invalide"),
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Le titre est requis")
    .isLength({ min: 2, max: 200 })
    .withMessage("Le titre doit contenir entre 2 et 200 caractères")
    .escape(),
  body("startTime")
    .notEmpty()
    .withMessage("L'heure de début est requise")
    .isISO8601()
    .withMessage("Format de date invalide"),
  body("endTime")
    .notEmpty()
    .withMessage("L'heure de fin est requise")
    .isISO8601()
    .withMessage("Format de date invalide")
    .custom((endTime, { req }) => {
      if (new Date(endTime) <= new Date(req.body.startTime)) {
        throw new Error("L'heure de fin doit être après l'heure de début");
      }
      return true;
    }),
  handleValidation,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateRoom,
  validateReservation,
};
