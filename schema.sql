-- ============================================================
-- SCRIPT D'INSTALLATION - Base de données coop_miel
-- Cooperative Apicole Kawit - Tlemcen
-- ============================================================

CREATE DATABASE coop_miel;

-- Connectez-vous à la base avant d'exécuter la suite :
-- \c coop_miel

-- ============================================================
-- 1. CATEGORIES
-- ============================================================
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO categories (nom) VALUES
  ('Miels'),
  ('Pollen'),
  ('Cire & Propolis'),
  ('Coffrets');

-- ============================================================
-- 2. PRODUITS
-- ============================================================
CREATE TABLE produits (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(200) NOT NULL,
  description TEXT,
  prix NUMERIC(10, 2) NOT NULL,
  stock_quantite INTEGER NOT NULL DEFAULT 0,
  categorie_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT '{}',
  origine VARCHAR(100) DEFAULT 'Tlemcen, Algérie',
  recolte VARCHAR(10) DEFAULT '2025',
  video_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 3. UTILISATEURS
-- ============================================================
CREATE TABLE utilisateurs (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  mot_de_passe VARCHAR(255) NOT NULL,
  telephone VARCHAR(30),
  role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  email_verifie BOOLEAN DEFAULT FALSE,
  token_verification VARCHAR(255),
  token_reset_password VARCHAR(255),
  token_reset_expiry TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Création du compte admin (mot de passe : Admin1234)
INSERT INTO utilisateurs (nom, email, mot_de_passe, role, email_verifie)
VALUES (
  'Admin',
  'admin@nhal.dz',
  '$2b$10$O/euzn1fhijJNRIrmmrwJuluDxvl6lpZFig01HJ0BvS7g3TsR.Ouu',
  'admin',
  TRUE
);

-- ============================================================
-- 4. COMMANDES
-- ============================================================
CREATE TABLE commandes (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
  nom_client VARCHAR(100) NOT NULL DEFAULT '',
  telephone_client VARCHAR(30) NOT NULL DEFAULT '',
  adresse_livraison TEXT NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  statut VARCHAR(20) DEFAULT 'en_attente'
    CHECK (statut IN ('en_attente', 'confirmee', 'en_livraison', 'livree', 'annulee')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 5. LIGNES DE COMMANDE
-- ============================================================
CREATE TABLE lignes_commande (
  id SERIAL PRIMARY KEY,
  commande_id INTEGER NOT NULL REFERENCES commandes(id) ON DELETE CASCADE,
  produit_id INTEGER REFERENCES produits(id) ON DELETE SET NULL,
  quantite INTEGER NOT NULL DEFAULT 1,
  prix_unitaire NUMERIC(10, 2) NOT NULL
);

-- ============================================================
-- INDEX (pour les performances)
-- ============================================================
CREATE INDEX idx_produits_categorie ON produits(categorie_id);
CREATE INDEX idx_commandes_client ON commandes(client_id);
CREATE INDEX idx_commandes_statut ON commandes(statut);
CREATE INDEX idx_lignes_commande ON lignes_commande(commande_id);
CREATE INDEX idx_utilisateurs_email ON utilisateurs(email);
