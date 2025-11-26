-- =====================================
-- Création des utilisateurs
-- =====================================
INSERT INTO users (username, email, password, role_id) VALUES
('alice', 'alice@example.com', '$2y$10$hash1', 2),
('bob', 'bob@example.com', '$2y$10$hash2', 2),
('charlie', 'charlie@example.com', '$2y$10$hash3', 2),
('david', 'david@example.com', '$2y$10$hash4', 2),
('eve', 'eve@example.com', '$2y$10$hash5', 2);

-- =====================================
-- Création des catégories
-- =====================================
-- Supposons une table categories : id, user_id, name, color
INSERT INTO categories (user_id, name, color) VALUES
-- Catégories Alice (user_id = 1)
(1, 'Travail', '#f87171'),
(1, 'Perso', '#34d399'),
(1, 'Loisirs', '#60a5fa'),

-- Catégories Bob (user_id = 2)
(2, 'Travail', '#f87171'),
(2, 'Famille', '#a78bfa'),
(2, 'Sport', '#fbbf24'),

-- Catégories Charlie (user_id = 3)
(3, 'Projet', '#f87171'),
(3, 'Etude', '#34d399'),
(3, 'Hobby', '#60a5fa'),

-- Catégories David (user_id = 4)
(4, 'Urgent', '#f87171'),
(4, 'Routine', '#34d399'),
(4, 'Divertissement', '#60a5fa'),

-- Catégories Eve (user_id = 5)
(5, 'Pro', '#f87171'),
(5, 'Maison', '#34d399'),
(5, 'Loisir', '#60a5fa');

-- =====================================
-- Création des tâches
-- =====================================
-- Alice
INSERT INTO tasks (user_id, title, description, status, category_id) VALUES
(1, 'Réunion équipe', 'Préparer les slides pour la réunion', 'pending', 1),
(1, 'Appeler le client', 'Confirmer la commande', 'pending', 1),
(1, 'Yoga', 'Séance de yoga', 'done', 3),
(1, 'Courses', 'Acheter du lait et du pain', 'pending', 2);

-- Bob
INSERT INTO tasks (user_id, title, description, status, category_id) VALUES
(2, 'Préparer le rapport', 'Envoyer le rapport au manager', 'pending', 4),
(2, 'Dîner famille', 'Organiser le dîner du dimanche', 'pending', 5),
(2, 'Foot', 'Aller jouer au foot', 'done', 6);

-- Charlie
INSERT INTO tasks (user_id, title, description, status, category_id) VALUES
(3, 'Projet React', 'Terminer le front-end', 'pending', 7),
(3, 'Révision Maths', 'Chapitre 5', 'done', 8),
(3, 'Peinture', 'Peindre le portrait', 'pending', 9);

-- David
INSERT INTO tasks (user_id, title, description, status, category_id) VALUES
(4, 'Factures', 'Payer les factures avant le 25', 'pending', 10),
(4, 'Routine Gym', 'Séance jambes', 'done', 11),
(4, 'Film', 'Regarder le dernier film', 'pending', 12);

-- Eve
INSERT INTO tasks (user_id, title, description, status, category_id) VALUES
(5, 'Projet client', 'Finaliser le projet', 'pending', 13),
(5, 'Nettoyage', 'Ranger la maison', 'done', 14),
(5, 'Lecture', 'Lire un chapitre', 'pending', 15);
