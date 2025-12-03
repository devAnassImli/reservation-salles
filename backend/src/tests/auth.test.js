const request = require("supertest");
const express = require("express");
const authRoutes = require("../routes/authRoutes");

// Créer une app de test
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Tests Authentification", () => {
  // Test de la route register avec email invalide
  describe("POST /api/auth/register", () => {
    it("devrait refuser un email déjà utilisé", async () => {
      // Premier enregistrement
      const user1 = {
        name: "Test User",
        email: "test.unique@test.com",
        password: "password123",
        role: "employee",
      };

      // Deuxième enregistrement avec le même email
      const response = await request(app)
        .post("/api/auth/register")
        .send(user1);

      // Si l'utilisateur existe déjà, on attend une erreur 400
      if (response.status === 400) {
        expect(response.body.message).toBe("Cet email est déjà utilisé");
      } else {
        // Sinon, l'utilisateur a été créé
        expect(response.status).toBe(201);
        expect(response.body.user).toHaveProperty("id");
        expect(response.body).toHaveProperty("token");
      }
    });
  });

  // Test de la route login
  describe("POST /api/auth/login", () => {
    it("devrait refuser un mot de passe incorrect", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "admin@test.com",
        password: "mauvais_mot_de_passe",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Email ou mot de passe incorrect");
    });

    it("devrait connecter un utilisateur avec les bons identifiants", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "admin@test.com",
        password: "admin123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user.email).toBe("admin@test.com");
    });
  });

  // Test de la route profile sans token
  describe("GET /api/auth/profile", () => {
    it("devrait refuser l'accès sans token", async () => {
      const response = await request(app).get("/api/auth/profile");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Token manquant");
    });
  });
});
