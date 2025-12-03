const request = require("supertest");
const express = require("express");
const roomRoutes = require("../routes/roomRoutes");
const authRoutes = require("../routes/authRoutes");

// Créer une app de test
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

let adminToken = "";

describe("Tests Salles", () => {
  // Récupérer un token admin avant les tests
  beforeAll(async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "admin123",
    });
    adminToken = response.body.token;
  });

  // Test de récupération des salles
  describe("GET /api/rooms", () => {
    it("devrait refuser l'accès sans token", async () => {
      const response = await request(app).get("/api/rooms");

      expect(response.status).toBe(401);
    });

    it("devrait retourner la liste des salles avec un token", async () => {
      const response = await request(app)
        .get("/api/rooms")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // Test de création de salle
  describe("POST /api/rooms", () => {
    it("devrait créer une salle (admin)", async () => {
      const response = await request(app)
        .post("/api/rooms")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Salle Test Jest",
          capacity: 8,
          equipment: "Écran, Webcam",
        });

      expect(response.status).toBe(201);
      expect(response.body.room.name).toBe("Salle Test Jest");
    });

    it("devrait refuser une salle sans nom", async () => {
      const response = await request(app)
        .post("/api/rooms")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          capacity: 8,
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Le nom et la capacité sont requis");
    });
  });

  // Test de récupération d'une salle par ID
  describe("GET /api/rooms/:id", () => {
    it("devrait retourner une salle existante", async () => {
      const response = await request(app)
        .get("/api/rooms/1")
        .set("Authorization", `Bearer ${adminToken}`);

      if (response.status === 200) {
        expect(response.body).toHaveProperty("name");
      } else {
        expect(response.status).toBe(404);
      }
    });

    it("devrait retourner 404 pour une salle inexistante", async () => {
      const response = await request(app)
        .get("/api/rooms/9999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });
});
