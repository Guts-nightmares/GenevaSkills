-- Schema BDD simplifie avec roles et permissions
-- Execute ce script dans DBeaver pour creer la base task_manager

-- Creation de la base (decommente si besoin)
-- CREATE DATABASE IF NOT EXISTS task_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE task_manager;

-- Roles
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Permissions
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Role-Permission (table pivot)
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT DEFAULT 2,
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    INDEX idx_username (username),
    INDEX idx_role (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT DEFAULT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deadline DATE,
    status ENUM('todo', 'done') DEFAULT 'todo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;









-- Roles par defaut
INSERT INTO roles (name, description) VALUES
('admin', 'Administrateur'),
('user', 'Utilisateur normal');

-- Permissions
INSERT INTO permissions (name, description) VALUES
('view_tasks', 'Voir les taches'),
('create_task', 'Creer une tache'),
('edit_task', 'Modifier une tache'),
('delete_task', 'Supprimer une tache'),
('view_categories', 'Voir les categories'),
('create_category', 'Creer une categorie'),
('edit_category', 'Modifier une categorie'),
('delete_category', 'Supprimer une categorie'),
('manage_users', 'Gerer les utilisateurs');

-- Permissions admin (toutes)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(1, 5), (1, 6), (1, 7), (1, 8), (1, 9);

-- Permissions user (pas manage_users)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(2, 1), (2, 2), (2, 3), (2, 4),
(2, 5), (2, 6), (2, 7), (2, 8);

-- Users demo
-- Password: admin123
INSERT INTO users (username, email, password, role_id) VALUES
('admin', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);

-- Password: user123
INSERT INTO users (username, email, password, role_id) VALUES
('user', 'user@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2);

-- Categories demo
INSERT INTO categories (user_id, name, color) VALUES
(1, 'Travail', '#EF4444'),
(1, 'Personnel', '#10B981'),
(2, 'Perso', '#8B5CF6');

-- Tasks demo
INSERT INTO tasks (user_id, category_id, title, description, deadline, status) VALUES
(1, 1, 'Faire le rapport', 'Rapport mensuel', DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'todo'),
(2, 3, 'Courses', 'Lait, pain', CURDATE(), 'todo');
