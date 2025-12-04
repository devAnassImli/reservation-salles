const request = require("supertest");
const express = require("express");
const authRoutes = require("../routes/authRoutes");

// Créer une app de test
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Tests Authentification", () => {
  // Test de la route register
  describe("POST /api/auth/register", () => {
    it("devrait refuser un email déjà utilisé", async () => {
      const user = {
        name: "Test User",
        email: "admin@test.com",
        password: "password123",
        role: "employee",
      };

      const response = await request(app).post("/api/auth/register").send(user);

      // L'utilisateur existe déjà, on attend une erreur 400
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Cet email est déjà utilisé");
    });

    it("devrait refuser un email invalide", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "Test",
        email: "email-invalide",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Données invalides");
    });

    it("devrait refuser un mot de passe trop court", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "Test",
        email: "nouveau@test.com",
        password: "123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Données invalides");
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

    it("devrait refuser un email invalide", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "email-invalide",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Données invalides");
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
