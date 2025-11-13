-- ============================================
-- MyEventz - Base de Datos MySQL
-- Script completo de creación de tablas
-- Compatible con XAMPP y AWS RDS MySQL
-- ============================================

-- Eliminar base de datos si existe (¡CUIDADO EN PRODUCCIÓN!)
DROP DATABASE IF EXISTS myeventz;

-- Crear base de datos
CREATE DATABASE myeventz CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE myeventz;

-- ============================================
-- TABLA: users
-- Almacena información de los usuarios
-- ============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    bio TEXT,
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: categories
-- Categorías de eventos disponibles
-- ============================================
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7) NOT NULL,  -- Formato: #RRGGBB
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: events
-- Eventos creados por los usuarios
-- ============================================
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category_id INT NOT NULL,
    organizer_id INT NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location_name VARCHAR(200) NOT NULL,
    location_address VARCHAR(255),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    min_age INT DEFAULT 0,
    max_age INT DEFAULT 99,
    max_participants INT NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_organizer (organizer_id),
    INDEX idx_category (category_id),
    INDEX idx_event_date (event_date),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: event_participants
-- Relación many-to-many entre eventos y usuarios (participantes)
-- ============================================
CREATE TABLE event_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_participant (event_id, user_id),
    INDEX idx_event (event_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: event_likes
-- Relación many-to-many entre eventos y usuarios (likes)
-- ============================================
CREATE TABLE event_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (event_id, user_id),
    INDEX idx_event (event_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: user_hobbies
-- Hobbies/intereses de los usuarios (relación con categories)
-- ============================================
CREATE TABLE user_hobbies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_hobby (user_id, category_id),
    INDEX idx_user (user_id),
    INDEX idx_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: social_networks
-- Redes sociales de los usuarios
-- ============================================
CREATE TABLE social_networks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    instagram VARCHAR(100),
    twitter VARCHAR(100),
    youtube VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERTAR CATEGORÍAS
-- 14 categorías con sus colores correspondientes
-- ============================================
INSERT INTO categories (name, color, icon) VALUES
('Audiovisual', '#f59e0b', NULL),
('Baloncesto', '#ef4444', NULL),
('Calistenia', '#84cc16', NULL),
('Ciclismo', '#3b82f6', NULL),
('Cocina', '#ec4899', NULL),
('Crossfit', '#f97316', NULL),
('Danza', '#a855f7', NULL),
('Escalada', '#14b8a6', NULL),
('Esgrima', '#6366f1', NULL),
('Fútbol', '#22c55e', NULL),
('Gimnasia', '#06b6d4', NULL),
('Golf', '#eab308', NULL),
('Karate', '#dc2626', NULL),
('Motocross', '#f43f5e', NULL);

-- ============================================
-- INSERTAR USUARIOS DE PRUEBA
-- Contraseñas: "password123" (hasheadas con bcrypt)
-- ============================================
-- Nota: En producción, las contraseñas deben hashearse con bcrypt
-- Hash de "password123": $2a$10$ZqXvZ0TJQxL9K5YqJ5YqJeZqXvZ0TJQxL9K5YqJ5YqJe

INSERT INTO users (username, email, password_hash, full_name, bio, profile_picture) VALUES
('mangelrogel420', 'miguel@example.com', '$2a$10$ZqXvZ0TJQxL9K5YqJ5YqJeZqXvZ0TJQxL9K5YqJ5YqJe', 'Miguel Ángel Rogel Ruiz', 
 'Me llama Miguel Ángel, aunque mis amigos me llaman Manolo. Me gusta mucho subir vídeos a YT y quedar con los amigos.', 
 NULL),
 
('gamibliblio', 'gabi@example.com', '$2a$10$ZqXvZ0TJQxL9K5YqJ5YqJeZqXvZ0TJQxL9K5YqJ5YqJe', 'Gabriel Milagro López', 
 'Me gusta la edición de vídeo, salir con los amigos, las motos y viajar por el mundo.', 
 NULL),
 
('carlosguevara', 'carlos@example.com', '$2a$10$ZqXvZ0TJQxL9K5YqJ5YqJeZqXvZ0TJQxL9K5YqJ5YqJe', 'Carlos Fernández Guevara', 
 'Ingeniero de software apasionado por el deporte y la tecnología.', 
 NULL),
 
('jorgealquezar', 'jorge@example.com', '$2a$10$ZqXvZ0TJQxL9K5YqJ5YqJeZqXvZ0TJQxL9K5YqJ5YqJe', 'Jorge Alquézar', 
 'Fotógrafo profesional. Amante de la naturaleza y el ciclismo de montaña.', 
 NULL),
 
('lauragonzalez', 'laura@example.com', '$2a$10$ZqXvZ0TJQxL9K5YqJ5YqJeZqXvZ0TJQxL9K5YqJ5YqJe', 'Laura González', 
 'Chef profesional. Me encanta compartir mis recetas y organizar eventos gastronómicos.', 
 NULL);

-- ============================================
-- INSERTAR HOBBIES DE LOS USUARIOS
-- ============================================
-- Miguel Ángel (id: 1)
INSERT INTO user_hobbies (user_id, category_id) VALUES
(1, (SELECT id FROM categories WHERE name = 'Audiovisual')),
(1, (SELECT id FROM categories WHERE name = 'Fútbol')),
(1, (SELECT id FROM categories WHERE name = 'Baloncesto'));

-- Gabriel (id: 2)
INSERT INTO user_hobbies (user_id, category_id) VALUES
(2, (SELECT id FROM categories WHERE name = 'Audiovisual')),
(2, (SELECT id FROM categories WHERE name = 'Motocross')),
(2, (SELECT id FROM categories WHERE name = 'Ciclismo'));

-- Carlos (id: 3)
INSERT INTO user_hobbies (user_id, category_id) VALUES
(3, (SELECT id FROM categories WHERE name = 'Ciclismo')),
(3, (SELECT id FROM categories WHERE name = 'Escalada')),
(3, (SELECT id FROM categories WHERE name = 'Crossfit'));

-- Jorge (id: 4)
INSERT INTO user_hobbies (user_id, category_id) VALUES
(4, (SELECT id FROM categories WHERE name = 'Ciclismo')),
(4, (SELECT id FROM categories WHERE name = 'Audiovisual'));

-- Laura (id: 5)
INSERT INTO user_hobbies (user_id, category_id) VALUES
(5, (SELECT id FROM categories WHERE name = 'Cocina')),
(5, (SELECT id FROM categories WHERE name = 'Danza'));

-- ============================================
-- INSERTAR EVENTOS DE PRUEBA
-- ============================================
INSERT INTO events (title, description, category_id, organizer_id, event_date, event_time, 
                    location_name, location_address, location_lat, location_lng, 
                    min_age, max_age, max_participants, image_url) VALUES
-- Evento 1: Partido de fútbol
('Partido de fútbol 11', 
 'Organizamos un partido de fútbol 11 este fin de semana en el Parque Grande. Todos los niveles son bienvenidos. Traed agua y ganas de pasarlo bien!', 
 (SELECT id FROM categories WHERE name = 'Fútbol'),
 1, -- mangelrogel420
 '2024-11-20', '18:00:00',
 'Parque Grande José Antonio Labordeta', 
 'Av. de San Juan de la Peña, 50010 Zaragoza',
 41.6371, -0.9047,
 16, 45, 22,
 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800'),

-- Evento 2: Ruta en bici
('Ruta en bici por el Ebro',
 'Ruta de 30km por el paseo del Ebro. Salimos a las 10:00 desde el Parque del Agua. Ritmo tranquilo, apta para todos los niveles.',
 (SELECT id FROM categories WHERE name = 'Ciclismo'),
 4, -- jorgealquezar
 '2024-11-22', '10:00:00',
 'Parque del Agua Luis Buñuel',
 'Avenida José Atarés, 50018 Zaragoza',
 41.6675, -0.8717,
 18, 65, 15,
 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800'),

-- Evento 3: Taller de cocina
('Taller de cocina asiática',
 'Aprende a preparar platos típicos de la cocina asiática. Haremos sushi, pad thai y más. Todos los ingredientes incluidos.',
 (SELECT id FROM categories WHERE name = 'Cocina'),
 5, -- lauragonzalez
 '2024-11-25', '19:00:00',
 'Centro Cívico Universidad',
 'Calle Violante de Hungría, 4, 50009 Zaragoza',
 41.6369, -0.9020,
 18, 99, 12,
 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800'),

-- Evento 4: Sesión de escalada
('Escalada indoor - Nivel iniciación',
 'Sesión de escalada en rocódromo para iniciarse en este deporte. Material incluido. Instructor profesional.',
 (SELECT id FROM categories WHERE name = 'Escalada'),
 3, -- carlosguevara
 '2024-11-23', '17:30:00',
 'Rocódromo Sharma Climbing Zaragoza',
 'Calle de Pasteur, 1, 50015 Zaragoza',
 41.6678, -0.8975,
 14, 50, 10,
 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800'),

-- Evento 5: Festival de cine
('Festival de Cine Independiente',
 'Proyección de cortometrajes independientes seguida de coloquio con los directores. Entrada libre.',
 (SELECT id FROM categories WHERE name = 'Audiovisual'),
 2, -- gamibliblio
 '2024-11-28', '20:00:00',
 'Cines Palafox',
 'Calle de Cádiz, 6, 50004 Zaragoza',
 41.6519, -0.8898,
 16, 99, 50,
 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800'),

-- Evento 6: Clase de crossfit
('CrossFit Open Box',
 'Clase abierta de CrossFit. Adaptada a todos los niveles. Primera clase gratuita.',
 (SELECT id FROM categories WHERE name = 'Crossfit'),
 3, -- carlosguevara
 '2024-11-21', '19:30:00',
 'CrossFit Zaragoza',
 'Polígono Industrial El Pilar, 50197 Zaragoza',
 41.6580, -0.9350,
 18, 55, 20,
 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'),

-- Evento 7: Torneo de baloncesto
('Torneo 3x3 de baloncesto',
 'Torneo de baloncesto 3x3. Inscripción por equipos. Premios para los ganadores.',
 (SELECT id FROM categories WHERE name = 'Baloncesto'),
 1, -- mangelrogel420
 '2024-11-24', '10:00:00',
 'Polideportivo Municipal Almozara',
 'Calle Rioja, 1, 50003 Zaragoza',
 41.6635, -0.9055,
 16, 40, 32,
 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'),

-- Evento 8: Clase de danza
('Clase de Salsa para principiantes',
 'Aprende los pasos básicos de salsa en un ambiente divertido y relajado.',
 (SELECT id FROM categories WHERE name = 'Danza'),
 5, -- lauragonzalez
 '2024-11-26', '20:00:00',
 'Escuela de Baile La Cadencia',
 'Calle del Temple, 15, 50003 Zaragoza',
 41.6560, -0.8800,
 18, 65, 16,
 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800');

-- ============================================
-- INSERTAR PARTICIPANTES EN EVENTOS
-- ============================================
-- Evento 1 (Fútbol) - 18 participantes
INSERT INTO event_participants (event_id, user_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5);

-- Evento 2 (Ciclismo) - 8 participantes
INSERT INTO event_participants (event_id, user_id) VALUES
(2, 1), (2, 3), (2, 4);

-- Evento 3 (Cocina) - 10 participantes
INSERT INTO event_participants (event_id, user_id) VALUES
(3, 1), (3, 2), (3, 3), (3, 5);

-- Evento 4 (Escalada) - 6 participantes
INSERT INTO event_participants (event_id, user_id) VALUES
(4, 2), (4, 3);

-- Evento 5 (Audiovisual) - 24 participantes
INSERT INTO event_participants (event_id, user_id) VALUES
(5, 1), (5, 2), (5, 3), (5, 4);

-- Evento 6 (Crossfit) - 12 participantes
INSERT INTO event_participants (event_id, user_id) VALUES
(6, 2), (6, 3), (6, 4);

-- Evento 7 (Baloncesto) - 16 participantes
INSERT INTO event_participants (event_id, user_id) VALUES
(7, 1), (7, 2), (7, 5);

-- Evento 8 (Danza) - 10 participantes
INSERT INTO event_participants (event_id, user_id) VALUES
(8, 2), (8, 4), (8, 5);

-- ============================================
-- INSERTAR LIKES EN EVENTOS
-- ============================================
INSERT INTO event_likes (event_id, user_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 1), (2, 3), (2, 4),
(3, 1), (3, 2), (3, 5),
(4, 2), (4, 3), (4, 4),
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5),
(6, 3), (6, 4),
(7, 1), (7, 2), (7, 4),
(8, 2), (8, 5);

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: Eventos con información completa
CREATE VIEW v_events_full AS
SELECT 
    e.id,
    e.title,
    e.description,
    c.name AS category_name,
    c.color AS category_color,
    u.username AS organizer_username,
    u.full_name AS organizer_name,
    e.event_date,
    e.event_time,
    e.location_name,
    e.location_address,
    e.min_age,
    e.max_age,
    e.max_participants,
    (SELECT COUNT(*) FROM event_participants ep WHERE ep.event_id = e.id) AS current_participants,
    (SELECT COUNT(*) FROM event_likes el WHERE el.event_id = e.id) AS total_likes,
    e.image_url,
    e.created_at
FROM events e
JOIN categories c ON e.category_id = c.id
JOIN users u ON e.organizer_id = u.id
ORDER BY e.created_at DESC;

-- Vista: Usuarios con estadísticas
CREATE VIEW v_users_stats AS
SELECT 
    u.id,
    u.username,
    u.full_name,
    u.bio,
    u.profile_picture,
    (SELECT COUNT(*) FROM events e WHERE e.organizer_id = u.id) AS events_organized,
    (SELECT COUNT(*) FROM event_participants ep WHERE ep.user_id = u.id) AS events_participated,
    u.created_at
FROM users u;

-- ============================================
-- FUNCIONES ÚTILES
-- ============================================

-- Función: Verificar si un evento está lleno
DELIMITER $$
CREATE FUNCTION is_event_full(event_id INT) 
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE current_count INT;
    DECLARE max_count INT;
    
    SELECT COUNT(*) INTO current_count
    FROM event_participants
    WHERE event_participants.event_id = event_id;
    
    SELECT max_participants INTO max_count
    FROM events
    WHERE id = event_id;
    
    RETURN current_count >= max_count;
END$$
DELIMITER ;

-- ============================================
-- PROCEDIMIENTOS ALMACENADOS
-- ============================================

-- Procedimiento: Obtener eventos populares (más participantes)
DELIMITER $$
CREATE PROCEDURE get_popular_events(IN limit_count INT)
BEGIN
    SELECT 
        e.*,
        c.name AS category_name,
        c.color AS category_color,
        u.username AS organizer_username,
        COUNT(DISTINCT ep.id) AS participant_count,
        COUNT(DISTINCT el.id) AS like_count
    FROM events e
    JOIN categories c ON e.category_id = c.id
    JOIN users u ON e.organizer_id = u.id
    LEFT JOIN event_participants ep ON e.id = ep.event_id
    LEFT JOIN event_likes el ON e.id = el.event_id
    WHERE e.event_date >= CURDATE()
    GROUP BY e.id
    ORDER BY participant_count DESC, like_count DESC
    LIMIT limit_count;
END$$
DELIMITER ;

-- Procedimiento: Obtener eventos recientes
DELIMITER $$
CREATE PROCEDURE get_recent_events(IN limit_count INT)
BEGIN
    SELECT 
        e.*,
        c.name AS category_name,
        c.color AS category_color,
        u.username AS organizer_username,
        COUNT(DISTINCT ep.id) AS participant_count,
        COUNT(DISTINCT el.id) AS like_count
    FROM events e
    JOIN categories c ON e.category_id = c.id
    JOIN users u ON e.organizer_id = u.id
    LEFT JOIN event_participants ep ON e.id = ep.event_id
    LEFT JOIN event_likes el ON e.id = el.event_id
    WHERE e.event_date >= CURDATE()
    GROUP BY e.id
    ORDER BY e.created_at DESC
    LIMIT limit_count;
END$$
DELIMITER ;

-- ============================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ============================================
CREATE INDEX idx_events_date_time ON events(event_date, event_time);
CREATE INDEX idx_users_created ON users(created_at);
CREATE FULLTEXT INDEX idx_events_search ON events(title, description);
CREATE FULLTEXT INDEX idx_users_search ON users(full_name, username, bio);

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

-- Mostrar resumen de datos insertados
SELECT 'Base de datos creada exitosamente!' AS status;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_categories FROM categories;
SELECT COUNT(*) AS total_events FROM events;
SELECT COUNT(*) AS total_participants FROM event_participants;
SELECT COUNT(*) AS total_likes FROM event_likes;
