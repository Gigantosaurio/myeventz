-- ============================================
-- MyEventz - Base de Datos Completa
-- Versión mejorada del esquema original
-- Compatible con el frontend React
-- ============================================

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- Eliminar base de datos si existe (¡CUIDADO EN PRODUCCIÓN!)
DROP DATABASE IF EXISTS myeventz;

-- Crear base de datos
CREATE DATABASE myeventz CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE myeventz;

-- ============================================
-- TABLA: usuarios
-- ============================================
CREATE TABLE usuarios (
  id_usuario INT NOT NULL AUTO_INCREMENT,
  usuario VARCHAR(30) UNIQUE NOT NULL,
  clave VARCHAR(255) NOT NULL,
  nombre VARCHAR(40) NULL,
  apel1 VARCHAR(60) NULL,
  apel2 VARCHAR(60) NULL,
  f_nac DATE NULL,
  bio VARCHAR(255) NULL,
  imagen_perfil VARCHAR(255) NULL,
  ig VARCHAR(60) NULL,
  fb VARCHAR(60) NULL,
  x VARCHAR(60) NULL,
  yt VARCHAR(60) NULL,
  tt VARCHAR(60) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario),
  INDEX idx_usuario (usuario),
  FULLTEXT INDEX idx_usuarios_search (nombre, apel1, apel2, usuario, bio)
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: categorias
-- ============================================
CREATE TABLE categorias (
  id_categoria INT NOT NULL AUTO_INCREMENT,
  categoria VARCHAR(50) NOT NULL,
  color VARCHAR(7) DEFAULT '#7c3aed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_categoria),
  INDEX idx_categoria (categoria)
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: eventos
-- ============================================
CREATE TABLE eventos (
  id_evento INT NOT NULL AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  titulo VARCHAR(80) NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  descripcion VARCHAR(255) NULL,
  edad_min INT DEFAULT 0,
  edad_max INT DEFAULT 99,
  ubicacion VARCHAR(255) NOT NULL,
  imagen VARCHAR(255) NULL,
  lat DECIMAL(10, 8) NULL,
  lng DECIMAL(11, 8) NULL,
  max_participantes INT DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_evento),
  INDEX idx_usuario (id_usuario),
  INDEX idx_fecha (fecha),
  INDEX idx_created_at (created_at),
  FULLTEXT INDEX idx_eventos_search (titulo, descripcion),
  CONSTRAINT fk_eventos_usuarios
    FOREIGN KEY (id_usuario)
    REFERENCES usuarios (id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: participantes_eventos
-- ============================================
CREATE TABLE participantes_eventos (
  id_participacion INT NOT NULL AUTO_INCREMENT,
  id_evento INT NOT NULL,
  id_usuario INT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_participacion),
  UNIQUE KEY unique_participacion (id_evento, id_usuario),
  INDEX idx_evento (id_evento),
  INDEX idx_usuario (id_usuario),
  CONSTRAINT fk_participantes_eventos
    FOREIGN KEY (id_evento)
    REFERENCES eventos (id_evento)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_participantes_usuarios
    FOREIGN KEY (id_usuario)
    REFERENCES usuarios (id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: eventos_likes
-- ============================================
CREATE TABLE eventos_likes (
  id_like INT NOT NULL AUTO_INCREMENT,
  id_evento INT NOT NULL,
  id_usuario INT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_like),
  UNIQUE KEY unique_like (id_evento, id_usuario),
  INDEX idx_evento (id_evento),
  INDEX idx_usuario (id_usuario),
  CONSTRAINT fk_likes_eventos
    FOREIGN KEY (id_evento)
    REFERENCES eventos (id_evento)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_likes_usuarios
    FOREIGN KEY (id_usuario)
    REFERENCES usuarios (id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: usuarios_hobbies
-- ============================================
CREATE TABLE usuarios_hobbies (
  id_usuario INT NOT NULL,
  id_categoria INT NOT NULL,
  UNIQUE KEY unique_hobby (id_usuario, id_categoria),
  INDEX idx_usuario (id_usuario),
  INDEX idx_categoria (id_categoria),
  CONSTRAINT fk_hobbies_usuarios
    FOREIGN KEY (id_usuario)
    REFERENCES usuarios (id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_hobbies_categorias
    FOREIGN KEY (id_categoria)
    REFERENCES categorias (id_categoria)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: eventos_categorias
-- ============================================
CREATE TABLE eventos_categorias (
  id_evento INT NOT NULL,
  id_categoria INT NOT NULL,
  UNIQUE KEY unique_evento_categoria (id_evento, id_categoria),
  INDEX idx_evento (id_evento),
  INDEX idx_categoria (id_categoria),
  CONSTRAINT fk_eventos_cat_eventos
    FOREIGN KEY (id_evento)
    REFERENCES eventos (id_evento)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_eventos_cat_categorias
    FOREIGN KEY (id_categoria)
    REFERENCES categorias (id_categoria)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERTAR USUARIOS DE PRUEBA
-- ============================================
-- Nota: Contraseñas hasheadas con bcrypt en producción
-- Hash de "123": $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

INSERT INTO usuarios (usuario, clave, nombre, apel1, apel2, f_nac, bio) VALUES
('gamiluu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
 'Gabriel', 'Milagro', 'López', '2002-05-19', 
 'Hola me gusta la nintendo y el skate.'),
 
('charly', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
 'Carlos', 'Fernández', 'Guevara', '2002-05-16', 
 'Gym y Star Wars.'),
 
('gigantosaurio', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
 'Jorge', 'Alquezar', '', '2002-05-16', 
 'Me gusta el ARK y el furbo.'),
 
('carver', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
 'Noe', '', '', '2002-05-16', 
 'Rulando con la motico.'),

('mangelrogel420', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
 'Miguel Ángel', 'Rogel', 'Ruiz', '2001-08-15', 
 'Me gusta subir vídeos a YouTube y quedar con los amigos.');

-- ============================================
-- INSERTAR CATEGORÍAS (Selección de 50)
-- Con colores específicos para el frontend
-- ============================================
INSERT INTO categorias (categoria, color) VALUES
-- Deportes principales (14 del frontend original)
('Fútbol', '#22c55e'),
('Baloncesto', '#ef4444'),
('Ciclismo', '#3b82f6'),
('Escalada', '#14b8a6'),
('Gimnasia', '#06b6d4'),
('Golf', '#eab308'),
('Esgrima', '#6366f1'),
('Karate', '#dc2626'),
('Crossfit', '#f97316'),
('Danza', '#a855f7'),
('Calistenia', '#84cc16'),
('Motocross', '#f43f5e'),
('Cocina', '#ec4899'),
('Audiovisual', '#f59e0b'),

-- Deportes adicionales
('Tenis', '#10b981'),
('Natación', '#06b6d4'),
('Atletismo', '#f97316'),
('Rugby', '#059669'),
('Voleibol', '#8b5cf6'),
('Volei Playa', '#fbbf24'),
('Hockey', '#3b82f6'),
('Boxeo', '#dc2626'),
('Artes marciales', '#7c3aed'),
('Surf', '#0ea5e9'),
('Esquí', '#60a5fa'),
('Snowboard', '#38bdf8'),
('Patinaje', '#a78bfa'),
('Yoga', '#86efac'),
('Pilates', '#fde047'),
('Parkour', '#fb923c'),
('Paintball', '#f87171'),

-- Videojuegos populares
('Fortnite', '#8b5cf6'),
('League of Legends', '#eab308'),
('Valorant', '#ef4444'),
('Call of Duty', '#064e3b'),
('Minecraft', '#22c55e'),
('FIFA', '#3b82f6'),

-- Actividades sociales
('Senderismo', '#84cc16'),
('Picnic', '#fbbf24'),
('Camping', '#059669'),
('Karaoke', '#ec4899'),
('Juegos de mesa', '#8b5cf6'),
('Barbacoa', '#f97316'),
('Concierto', '#7c3aed'),
('Escape room', '#06b6d4'),
('Cine', '#6366f1'),
('Playa', '#0ea5e9'),
('Fotografía', '#f59e0b');

-- ============================================
-- INSERTAR EVENTOS DE PRUEBA
-- ============================================
INSERT INTO eventos (id_usuario, titulo, fecha, hora, descripcion, edad_min, edad_max, 
                     ubicacion, imagen, lat, lng, max_participantes) VALUES
-- Evento 1
(5, 'Partido de fútbol 11', '2024-12-15', '18:00', 
 'Partido de fútbol 11 en el Parque Grande. Todos los niveles bienvenidos!', 
 16, 45, 'Parque Grande José Antonio Labordeta', 
 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
 41.6371, -0.9047, 22),

-- Evento 2
(3, 'Ruta en bici por el Ebro', '2024-12-18', '10:00', 
 'Ruta de 30km por el paseo del Ebro. Ritmo tranquilo, apta para todos.', 
 18, 65, 'Parque del Agua Luis Buñuel', 
 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
 41.6675, -0.8717, 15),

-- Evento 3
(2, 'Torneo Mortal Kombat 11', '2024-12-20', '19:00', 
 'Torneo de MK11. Inscripción gratuita. Premios para los ganadores!', 
 16, 99, 'CiberZGZ', 
 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
 41.6519, -0.8898, 32),

-- Evento 4
(1, 'Quedada Parkour', '2024-12-22', '17:00', 
 'Sesión de parkour para todos los niveles. Traed agua y ganas!', 
 14, 30, 'Parque Delicias', 
 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
 41.6401, -0.9012, 20),

-- Evento 5
(4, 'Ruta en moto', '2024-12-25', '09:00', 
 'Ruta hasta las pozas de Pígalo. Moto obligatoria, carnet A2 mínimo.', 
 18, 50, 'Estación Delicias', 
 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800',
 41.6385, -0.9070, 12),

-- Evento 6
(5, 'Taller de cocina asiática', '2024-12-28', '19:30', 
 'Aprende a preparar sushi y pad thai. Ingredientes incluidos.', 
 18, 99, 'Centro Cívico Universidad', 
 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
 41.6369, -0.9020, 12),

-- Evento 7
(2, 'Escalada indoor', '2024-12-30', '18:00', 
 'Sesión de escalada en rocódromo. Material incluido. Instructor profesional.', 
 14, 55, 'Rocódromo Sharma Climbing', 
 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800',
 41.6678, -0.8975, 10),

-- Evento 8
(1, 'Barbacoa de fin de año', '2025-01-05', '14:00', 
 'Barbacoa para celebrar el año nuevo. Traed vuestras bebidas!', 
 18, 99, 'Parque Grande - Zona BBQ', 
 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
 41.6380, -0.9055, 30);

-- ============================================
-- RELACIONAR EVENTOS CON CATEGORÍAS
-- ============================================
INSERT INTO eventos_categorias (id_evento, id_categoria) VALUES
(1, (SELECT id_categoria FROM categorias WHERE categoria = 'Fútbol')),
(2, (SELECT id_categoria FROM categorias WHERE categoria = 'Ciclismo')),
(3, (SELECT id_categoria FROM categorias WHERE categoria = 'Audiovisual')),
(4, (SELECT id_categoria FROM categorias WHERE categoria = 'Parkour')),
(5, (SELECT id_categoria FROM categorias WHERE categoria = 'Motocross')),
(6, (SELECT id_categoria FROM categorias WHERE categoria = 'Cocina')),
(7, (SELECT id_categoria FROM categorias WHERE categoria = 'Escalada')),
(8, (SELECT id_categoria FROM categorias WHERE categoria = 'Barbacoa'));

-- ============================================
-- INSERTAR PARTICIPANTES
-- ============================================
INSERT INTO participantes_eventos (id_evento, id_usuario) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 1), (2, 2), (2, 5),
(3, 1), (3, 3), (3, 4), (3, 5),
(4, 2), (4, 3), (4, 5),
(5, 1), (5, 3),
(6, 1), (6, 2), (6, 4),
(7, 2), (7, 3), (7, 4),
(8, 1), (8, 2), (8, 3), (8, 4), (8, 5);

-- ============================================
-- INSERTAR LIKES
-- ============================================
INSERT INTO eventos_likes (id_evento, id_usuario) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 1), (2, 3), (2, 5),
(3, 1), (3, 2), (3, 4), (3, 5),
(4, 1), (4, 2), (4, 5),
(5, 1), (5, 4),
(6, 1), (6, 2), (6, 3),
(7, 2), (7, 3), (7, 4),
(8, 1), (8, 2), (8, 3), (8, 4), (8, 5);

-- ============================================
-- INSERTAR HOBBIES DE USUARIOS
-- ============================================
-- Usuario 1 (gamiluu)
INSERT INTO usuarios_hobbies (id_usuario, id_categoria) VALUES
(1, (SELECT id_categoria FROM categorias WHERE categoria = 'Audiovisual')),
(1, (SELECT id_categoria FROM categorias WHERE categoria = 'Parkour')),
(1, (SELECT id_categoria FROM categorias WHERE categoria = 'Minecraft'));

-- Usuario 2 (charly)
INSERT INTO usuarios_hobbies (id_usuario, id_categoria) VALUES
(2, (SELECT id_categoria FROM categorias WHERE categoria = 'Gimnasia')),
(2, (SELECT id_categoria FROM categorias WHERE categoria = 'Escalada')),
(2, (SELECT id_categoria FROM categorias WHERE categoria = 'Crossfit'));

-- Usuario 3 (gigantosaurio)
INSERT INTO usuarios_hobbies (id_usuario, id_categoria) VALUES
(3, (SELECT id_categoria FROM categorias WHERE categoria = 'Fútbol')),
(3, (SELECT id_categoria FROM categorias WHERE categoria = 'Ciclismo'));

-- Usuario 4 (carver)
INSERT INTO usuarios_hobbies (id_usuario, id_categoria) VALUES
(4, (SELECT id_categoria FROM categorias WHERE categoria = 'Motocross')),
(4, (SELECT id_categoria FROM categorias WHERE categoria = 'Ciclismo'));

-- Usuario 5 (mangelrogel420)
INSERT INTO usuarios_hobbies (id_usuario, id_categoria) VALUES
(5, (SELECT id_categoria FROM categorias WHERE categoria = 'Audiovisual')),
(5, (SELECT id_categoria FROM categorias WHERE categoria = 'Fútbol')),
(5, (SELECT id_categoria FROM categorias WHERE categoria = 'Baloncesto')),
(5, (SELECT id_categoria FROM categorias WHERE categoria = 'Cocina'));

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: Eventos con información completa
CREATE VIEW v_eventos_completos AS
SELECT 
    e.id_evento,
    e.titulo,
    e.descripcion,
    e.fecha,
    e.hora,
    e.edad_min,
    e.edad_max,
    e.ubicacion,
    e.lat,
    e.lng,
    e.max_participantes,
    e.imagen,
    CONCAT(u.nombre, ' ', u.apel1, ' ', IFNULL(u.apel2, '')) AS organizador_nombre,
    u.usuario AS organizador_usuario,
    u.id_usuario AS organizador_id,
    u.imagen_perfil AS organizador_imagen,
    (SELECT COUNT(*) FROM participantes_eventos pe WHERE pe.id_evento = e.id_evento) AS participantes_actuales,
    (SELECT COUNT(*) FROM eventos_likes el WHERE el.id_evento = e.id_evento) AS total_likes,
    e.created_at
FROM eventos e
JOIN usuarios u ON e.id_usuario = u.id_usuario
ORDER BY e.created_at DESC;

-- Vista: Usuarios con estadísticas
CREATE VIEW v_usuarios_stats AS
SELECT 
    u.id_usuario,
    u.usuario,
    CONCAT(u.nombre, ' ', u.apel1, ' ', IFNULL(u.apel2, '')) AS nombre_completo,
    u.bio,
    u.imagen_perfil,
    u.f_nac,
    u.ig,
    u.fb,
    u.x,
    u.yt,
    u.tt,
    (SELECT COUNT(*) FROM eventos e WHERE e.id_usuario = u.id_usuario) AS eventos_organizados,
    (SELECT COUNT(*) FROM participantes_eventos pe WHERE pe.id_usuario = u.id_usuario) AS eventos_participados,
    u.created_at
FROM usuarios u;

-- Vista: Categorías con contador
CREATE VIEW v_categorias_stats AS
SELECT 
    c.id_categoria,
    c.categoria,
    c.color,
    COUNT(DISTINCT ec.id_evento) AS total_eventos,
    SUM(CASE WHEN e.fecha >= CURDATE() THEN 1 ELSE 0 END) AS eventos_proximos
FROM categorias c
LEFT JOIN eventos_categorias ec ON c.id_categoria = ec.id_categoria
LEFT JOIN eventos e ON ec.id_evento = e.id_evento
GROUP BY c.id_categoria, c.categoria, c.color;

-- ============================================
-- PROCEDIMIENTOS ALMACENADOS
-- ============================================

DELIMITER $$

-- Eventos populares
CREATE PROCEDURE sp_eventos_populares(IN p_limit INT)
BEGIN
    SELECT 
        e.*,
        COUNT(DISTINCT pe.id_participacion) AS participantes_count,
        COUNT(DISTINCT el.id_like) AS likes_count
    FROM eventos e
    LEFT JOIN participantes_eventos pe ON e.id_evento = pe.id_evento
    LEFT JOIN eventos_likes el ON e.id_evento = el.id_evento
    WHERE e.fecha >= CURDATE()
    GROUP BY e.id_evento
    ORDER BY participantes_count DESC, likes_count DESC
    LIMIT p_limit;
END$$

-- Eventos recientes
CREATE PROCEDURE sp_eventos_recientes(IN p_limit INT)
BEGIN
    SELECT 
        e.*,
        COUNT(DISTINCT pe.id_participacion) AS participantes_count,
        COUNT(DISTINCT el.id_like) AS likes_count
    FROM eventos e
    LEFT JOIN participantes_eventos pe ON e.id_evento = pe.id_evento
    LEFT JOIN eventos_likes el ON e.id_evento = el.id_evento
    WHERE e.fecha >= CURDATE()
    GROUP BY e.id_evento
    ORDER BY e.created_at DESC
    LIMIT p_limit;
END$$

-- Buscar eventos (mixto)
CREATE PROCEDURE sp_buscar_eventos(
    IN p_search VARCHAR(255),
    IN p_categoria_ids VARCHAR(255)
)
BEGIN
    IF p_categoria_ids IS NULL OR p_categoria_ids = '' THEN
        SELECT DISTINCT e.*
        FROM eventos e
        WHERE (p_search IS NULL OR p_search = '' OR 
               e.titulo LIKE CONCAT('%', p_search, '%') OR 
               e.descripcion LIKE CONCAT('%', p_search, '%') OR
               e.ubicacion LIKE CONCAT('%', p_search, '%'))
        AND e.fecha >= CURDATE()
        ORDER BY e.fecha ASC;
    ELSE
        SELECT DISTINCT e.*
        FROM eventos e
        INNER JOIN eventos_categorias ec ON e.id_evento = ec.id_evento
        WHERE (p_search IS NULL OR p_search = '' OR 
               e.titulo LIKE CONCAT('%', p_search, '%') OR 
               e.descripcion LIKE CONCAT('%', p_search, '%') OR
               e.ubicacion LIKE CONCAT('%', p_search, '%'))
        AND FIND_IN_SET(ec.id_categoria, p_categoria_ids) > 0
        AND e.fecha >= CURDATE()
        ORDER BY e.fecha ASC;
    END IF;
END$$

DELIMITER ;

-- ============================================
-- FUNCIONES ÚTILES
-- ============================================

DELIMITER $$

CREATE FUNCTION fn_evento_lleno(p_id_evento INT) 
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE v_participantes INT;
    DECLARE v_max INT;
    
    SELECT COUNT(*) INTO v_participantes
    FROM participantes_eventos
    WHERE id_evento = p_id_evento;
    
    SELECT max_participantes INTO v_max
    FROM eventos
    WHERE id_evento = p_id_evento;
    
    RETURN v_participantes >= v_max;
END$$

CREATE FUNCTION fn_nombre_completo(p_id_usuario INT) 
RETURNS VARCHAR(200)
DETERMINISTIC
BEGIN
    DECLARE v_nombre VARCHAR(200);
    
    SELECT CONCAT(nombre, ' ', apel1, ' ', IFNULL(apel2, ''))
    INTO v_nombre
    FROM usuarios
    WHERE id_usuario = p_id_usuario;
    
    RETURN v_nombre;
END$$

DELIMITER ;

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================
SELECT 'Base de datos creada exitosamente!' AS status;
SELECT COUNT(*) AS total_usuarios FROM usuarios;
SELECT COUNT(*) AS total_categorias FROM categorias;
SELECT COUNT(*) AS total_eventos FROM eventos;
SELECT COUNT(*) AS total_participantes FROM participantes_eventos;
SELECT COUNT(*) AS total_likes FROM eventos_likes;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
