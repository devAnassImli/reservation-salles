# 🏢 Gestionnaire de Réservation de Salles

Application web permettant aux employés d'une entreprise de réserver des salles de réunion.

![CI/CD](https://github.com/devAnassImli/reservation-salles/actions/workflows/ci.yml/badge.svg)

## 📋 Fonctionnalités

- **Authentification** : Inscription, connexion, déconnexion avec JWT
- **Gestion des salles** : Création, modification, suppression (admin)
- **Réservation** : Réserver une salle avec détection des conflits
- **Rôles** : Admin et Employé avec permissions différentes

## 🛠️ Technologies utilisées

### Backend

- Node.js / Express.js
- PostgreSQL
- JWT (JSON Web Tokens)
- Bcrypt.js

### Frontend

- React.js
- Tailwind CSS
- Axios
- React Router

### DevOps

- Docker / Docker Compose
- GitHub Actions (CI/CD)
- Jest (Tests unitaires)

## 📁 Structure du projet

```
reservation-salles/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration BDD
│   │   ├── controllers/    # Logique métier
│   │   ├── middlewares/    # Auth middleware
│   │   ├── models/         # Modèles de données
│   │   ├── routes/         # Routes API
│   │   └── tests/          # Tests unitaires
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── context/        # Context API
│   │   ├── pages/          # Pages
│   │   └── services/       # Services API
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🚀 Installation

### Prérequis

- Node.js (v18+)
- Docker et Docker Compose
- Git

### Étapes

1. **Cloner le projet**

```bash
git clone https://github.com/devAnassImli/reservation-salles.git
cd reservation-salles
```

2. **Lancer la base de données**

```bash
docker-compose up -d
```

3. **Initialiser la base de données**

```bash
Get-Content backend/src/config/init.sql | docker exec -i reservation_salles_db psql -U postgres -d reservation_salles
```

4. **Installer et lancer le backend**

```bash
cd backend
npm install
npm run dev
```

5. **Installer et lancer le frontend** (dans un autre terminal)

```bash
cd frontend
npm install
npm start
```

6. **Accéder à l'application**

- Frontend : http://localhost:3001
- Backend API : http://localhost:3000

## 🔐 API Endpoints

### Authentification

| Méthode | Route              | Description        |
| ------- | ------------------ | ------------------ |
| POST    | /api/auth/register | Inscription        |
| POST    | /api/auth/login    | Connexion          |
| GET     | /api/auth/profile  | Profil utilisateur |

### Salles

| Méthode | Route          | Description                 |
| ------- | -------------- | --------------------------- |
| GET     | /api/rooms     | Liste des salles            |
| GET     | /api/rooms/:id | Détail d'une salle          |
| POST    | /api/rooms     | Créer une salle (admin)     |
| PUT     | /api/rooms/:id | Modifier une salle (admin)  |
| DELETE  | /api/rooms/:id | Supprimer une salle (admin) |

### Réservations

| Méthode | Route                 | Description             |
| ------- | --------------------- | ----------------------- |
| GET     | /api/reservations     | Liste des réservations  |
| GET     | /api/reservations/my  | Mes réservations        |
| POST    | /api/reservations     | Créer une réservation   |
| DELETE  | /api/reservations/:id | Annuler une réservation |

## 🧪 Tests

```bash
cd backend
npm test
```

## 👤 Auteur

**Anass Imli**

- GitHub: [@devAnassImli](https://github.com/devAnassImli)

## 📄 Licence

Ce projet est réalisé dans le cadre du titre professionnel Concepteur Développeur d'Applications (CDA).
