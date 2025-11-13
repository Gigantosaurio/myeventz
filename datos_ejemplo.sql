-- Script para poblar la base de datos MyEventz con datos de ejemplo
-- Ejecutar después de crear las tablas

USE myeventz;

-- Insertar eventos de ejemplo (asumiendo que ya tienes usuarios y categorías)
-- Ajusta los id_usuario según los usuarios que tengas en tu BD

-- Eventos variados con diferentes fechas
INSERT INTO eventos (id_usuario, titulo, fecha, hora, descripcion, edad_min, edad_max, ubicacion, lat, lng, max_participantes) VALUES
(1, 'Partido de Fútbol 7', '2025-01-15', '18:00', 'Partido amistoso de fútbol 7 en el Parque Grande. Nivel principiante/intermedio.', 16, 45, 'Parque Grande José Antonio Labordeta', 41.6488, -0.8891, 14),
(1, 'Ruta MTB Sierra de Guara', '2025-01-20', '09:00', 'Ruta en bicicleta de montaña por la Sierra de Guara. Nivel intermedio, 40km aprox.', 18, 60, 'Sierra de Guara', 42.2167, -0.0667, 15),
(1, 'Torneo Street Fighter VI', '2025-01-18', '17:00', 'Torneo de Street Fighter VI. Inscripción gratuita, premios para los 3 primeros.', 14, 99, 'Centro Cívico Delicias', 41.6388, -0.9089, 32),
(1, 'Clase de Cocina Italiana', '2025-01-22', '19:00', 'Aprende a hacer pasta fresca y tiramisú auténtico con un chef profesional.', 16, 70, 'Escuela de Hostelería', 41.6562, -0.8773, 12),
(1, 'Sesión de CrossFit', '2025-01-16', '20:00', 'Entrenamiento funcional de alta intensidad. Todos los niveles bienvenidos.', 18, 55, 'Box CrossFit Zaragoza', 41.6498, -0.8856, 20);

-- Más eventos con diferentes categorías
INSERT INTO eventos (id_usuario, titulo, fecha, hora, descripcion, edad_min, edad_max, ubicacion, lat, lng, max_participantes) VALUES
(1, 'Partido de Baloncesto 3x3', '2025-01-25', '18:30', 'Partidos de baloncesto 3x3 en el polideportivo. Formato torneo.', 16, 40, 'Polideportivo Municipal', 41.6520, -0.8875, 12),
(1, 'Taller de Fotografía Urbana', '2025-01-28', '10:00', 'Aprende técnicas de fotografía urbana mientras recorremos el casco antiguo.', 16, 65, 'Plaza del Pilar', 41.6561, -0.8773, 15),
(1, 'Ruta de Senderismo Moncayo', '2025-02-01', '08:00', 'Senderismo al pico del Moncayo. Nivel moderado, 18km ida y vuelta.', 18, 65, 'Parque Natural del Moncayo', 41.7833, -1.8167, 25),
(1, 'Clase de Danza Urbana', '2025-01-30', '19:30', 'Hip hop y street dance para principiantes. No se necesita experiencia.', 14, 35, 'Centro Cultural', 41.6470, -0.8910, 20),
(1, 'Torneo de Pádel', '2025-02-05', '16:00', 'Torneo de pádel por parejas. Nivel intermedio.', 18, 55, 'Club de Pádel Zaragoza', 41.6600, -0.8800, 16);

-- Eventos adicionales para tener más variedad
INSERT INTO eventos (id_usuario, titulo, fecha, hora, descripcion, edad_min, edad_max, ubicacion, lat, lng, max_participantes) VALUES
(1, 'Yoga en el Parque', '2025-01-17', '09:00', 'Sesión de yoga al aire libre. Trae tu propia esterilla.', 16, 70, 'Parque Primo de Rivera', 41.6650, -0.8820, 30),
(1, 'Escalada en Rocódromo', '2025-01-19', '18:00', 'Iniciación a la escalada indoor. Material incluido.', 14, 50, 'Rocódromo Sharma', 41.6420, -0.8950, 15),
(1, 'Maratón de Videojuegos', '2025-02-08', '14:00', 'Maratón de juegos retro y actuales. Consolas y PC disponibles.', 16, 99, 'Gaming Center', 41.6580, -0.8890, 40),
(1, 'Taller de Cocina Japonesa', '2025-02-10', '18:30', 'Aprende a hacer sushi, ramen y otros platos japoneses.', 18, 70, 'Escuela de Cocina Asia', 41.6550, -0.8770, 10),
(1, 'Carrera Popular 10K', '2025-02-15', '10:00', 'Carrera popular de 10 kilómetros por el centro de Zaragoza.', 16, 70, 'Plaza España', 41.6488, -0.8891, 500);

-- Eventos con fechas pasadas para probar filtros
INSERT INTO eventos (id_usuario, titulo, fecha, hora, descripcion, edad_min, edad_max, ubicacion, lat, lng, max_participantes) VALUES
(1, 'Partido de Voleibol Playa', '2024-12-20', '17:00', 'Voleibol playa en el polideportivo. Nivel todos.', 16, 45, 'Polideportivo La Cartuja', 41.6350, -0.8900, 8),
(1, 'Taller de Graffiti', '2024-12-15', '16:00', 'Iniciación al arte urbano con artistas locales.', 14, 40, 'Centro Joven', 41.6490, -0.8880, 12);

-- Asociar eventos con categorías (ajusta los IDs según tus categorías)
-- Suponiendo que las categorías tienen estos IDs aproximados:
-- 1=Audiovisual, 2=Baloncesto, 3=Calistenia, 4=Ciclismo, 5=Cocina, 6=Crossfit,
-- 7=Danza, 8=Escalada, 9=Esgrima, 10=Fútbol, 11=Gimnasia, 12=Golf, 13=Karate, 14=Motocross

INSERT INTO eventos_categorias (id_evento, id_categoria) VALUES
(1, 10),  -- Fútbol
(2, 4),   -- Ciclismo/MTB
(3, 1),   -- Audiovisual/Gaming
(4, 5),   -- Cocina
(5, 6),   -- CrossFit
(6, 2),   -- Baloncesto
(7, 1),   -- Audiovisual/Fotografía
(8, 11),  -- Gimnasia/Senderismo
(9, 7),   -- Danza
(10, 2),  -- Baloncesto/Pádel (podría ser otra categoría)
(11, 11), -- Gimnasia/Yoga
(12, 8),  -- Escalada
(13, 1),  -- Audiovisual/Gaming
(14, 5),  -- Cocina
(15, 11), -- Gimnasia/Running
(16, 2),  -- Baloncesto/Voleibol
(17, 1);  -- Audiovisual/Graffiti

-- Añadir algunos participantes a los eventos
INSERT INTO participantes_eventos (id_evento, id_usuario) VALUES
(1, 1),
(2, 1),
(3, 1),
(1, 2),
(1, 3),
(2, 2),
(3, 2),
(3, 3),
(4, 1);

-- Añadir algunos likes a los eventos
INSERT INTO eventos_likes (id_evento, id_usuario) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2),
(3, 1),
(3, 2),
(3, 3),
(4, 2),
(5, 1),
(5, 2);

-- Ver resumen de datos insertados
SELECT 'Eventos insertados' as Resumen, COUNT(*) as Total FROM eventos
UNION ALL
SELECT 'Eventos-Categorías asociados', COUNT(*) FROM eventos_categorias
UNION ALL
SELECT 'Participantes totales', COUNT(*) FROM participantes_eventos
UNION ALL
SELECT 'Likes totales', COUNT(*) FROM eventos_likes;
