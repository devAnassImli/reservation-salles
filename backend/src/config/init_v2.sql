-- =============================================
-- SCHEMA BASE DE DONNÉES - ROOMBOOK
-- Version 2.0 - Schéma complet pour CDA
-- =============================================

-- Suppression des tables existantes (dans l'ordre des dépendances)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS room_equipments CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS equipments CASCADE;
DROP TABLE IF EXISTS room_types CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- =============================================
-- TABLE: departments (Départements)
-- =============================================
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE: users (Utilisateurs)
-- =============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'employee' CHECK (role IN ('admin', 'employee', 'manager')),
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE: room_types (Types de salles)
-- =============================================
CREATE TABLE room_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE: equipments (Équipements)
-- =============================================
CREATE TABLE equipments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE: rooms (Salles)
-- =============================================
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    floor INTEGER DEFAULT 0,
    building VARCHAR(100),
    room_type_id INTEGER REFERENCES room_types(id) ON DELETE SET NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    hourly_rate DECIMAL(10,2) DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE: room_equipments (Liaison Salles-Équipements)
-- Relation Many-to-Many
-- =============================================
CREATE TABLE room_equipments (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    equipment_id INTEGER NOT NULL REFERENCES equipments(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(room_id, equipment_id)
);

-- =============================================
-- TABLE: reservations (Réservations)
-- =============================================
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    attendees_count INTEGER DEFAULT 1,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_times CHECK (end_time > start_time)
);

-- =============================================
-- TABLE: notifications (Notifications)
-- =============================================
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE: audit_logs (Logs d'audit)
-- =============================================
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- INDEX pour améliorer les performances
-- =============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_rooms_type ON rooms(room_type_id);
CREATE INDEX idx_rooms_active ON rooms(is_active);
CREATE INDEX idx_rooms_capacity ON rooms(capacity);

CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_room ON reservations(room_id);
CREATE INDEX idx_reservations_times ON reservations(start_time, end_time);
CREATE INDEX idx_reservations_status ON reservations(status);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- =============================================
-- DONNÉES INITIALES
-- =============================================

-- Départements
INSERT INTO departments (name, description) VALUES
('Direction', 'Direction générale de l''entreprise'),
('Ressources Humaines', 'Gestion du personnel et recrutement'),
('Informatique', 'Développement et infrastructure IT'),
('Marketing', 'Communication et stratégie marketing'),
('Commercial', 'Ventes et relations clients'),
('Finance', 'Comptabilité et gestion financière');

-- Types de salles
INSERT INTO room_types (name, description, color) VALUES
('Réunion', 'Salle de réunion standard', '#3B82F6'),
('Conférence', 'Grande salle pour conférences et présentations', '#8B5CF6'),
('Formation', 'Salle équipée pour formations', '#10B981'),
('Brainstorming', 'Espace créatif pour sessions de brainstorming', '#F59E0B'),
('Visioconférence', 'Salle équipée pour visioconférences', '#EF4444');

-- Équipements
INSERT INTO equipments (name, description, icon) VALUES
('Vidéoprojecteur', 'Projecteur HD pour présentations', 'projector'),
('Tableau blanc', 'Tableau blanc effaçable', 'whiteboard'),
('Écran interactif', 'Écran tactile interactif', 'screen'),
('Webcam HD', 'Caméra haute définition pour visioconférence', 'camera'),
('Système audio', 'Système de sonorisation', 'speaker'),
('Climatisation', 'Système de climatisation individuel', 'ac'),
('Paperboard', 'Chevalet de conférence', 'paperboard'),
('Téléphone conférence', 'Téléphone pour conférences téléphoniques', 'phone'),
('Wifi haute vitesse', 'Connexion internet haut débit', 'wifi'),
('Prises électriques', 'Prises multiples pour ordinateurs', 'plug');

-- Message de confirmation
SELECT 'Base de données initialisée avec succès !' AS message;