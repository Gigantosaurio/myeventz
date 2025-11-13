import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { dbPool } from '../config/database';
import { EventCreateInput, EventDetail } from '../types';

/**
 * Obtener eventos populares (ordenados por participantes y likes)
 */
export const getPopularEvents = async (limit: number = 10): Promise<any[]> => {
  const [rows] = await dbPool.execute<RowDataPacket[]>(
    `SELECT
      e.id_evento,
      e.id_usuario,
      e.titulo,
      e.fecha,
      e.hora,
      e.descripcion,
      e.edad_min,
      e.edad_max,
      e.ubicacion,
      e.lat,
      e.lng,
      e.max_participantes,
      e.imagen,
      e.created_at,
      e.updated_at,
      CONCAT(u.nombre, ' ', u.apel1, ' ', IFNULL(u.apel2, '')) AS organizador_nombre,
      u.usuario AS organizador_usuario,
      u.imagen_perfil AS organizador_imagen,
      u.id_usuario AS organizador_id,
      c.categoria AS categoria_nombre,
      c.color AS categoria_color,
      COUNT(DISTINCT pe.id_usuario) AS participantes_actuales,
      COUNT(DISTINCT el.id_usuario) AS total_likes
    FROM eventos e
    JOIN usuarios u ON e.id_usuario = u.id_usuario
    LEFT JOIN eventos_categorias ec ON e.id_evento = ec.id_evento
    LEFT JOIN categorias c ON ec.id_categoria = c.id_categoria
    LEFT JOIN participantes_eventos pe ON e.id_evento = pe.id_evento
    LEFT JOIN eventos_likes el ON e.id_evento = el.id_evento
    GROUP BY e.id_evento, e.id_usuario, e.titulo, e.fecha, e.hora, e.descripcion,
             e.edad_min, e.edad_max, e.ubicacion, e.lat, e.lng, e.max_participantes,
             e.imagen, e.created_at, e.updated_at, u.nombre, u.apel1, u.apel2,
             u.usuario, u.imagen_perfil, u.id_usuario, c.categoria, c.color
    ORDER BY (COUNT(DISTINCT pe.id_usuario) + COUNT(DISTINCT el.id_usuario)) DESC, e.fecha ASC
    LIMIT ?`,
    [limit]
  );
  return rows;
};

/**
 * Obtener eventos recientes (ordenados por fecha de creación)
 */
export const getRecentEvents = async (limit: number = 20): Promise<any[]> => {
  const [rows] = await dbPool.execute<RowDataPacket[]>(
    `SELECT
      e.id_evento,
      e.id_usuario,
      e.titulo,
      e.fecha,
      e.hora,
      e.descripcion,
      e.edad_min,
      e.edad_max,
      e.ubicacion,
      e.lat,
      e.lng,
      e.max_participantes,
      e.imagen,
      e.created_at,
      e.updated_at,
      CONCAT(u.nombre, ' ', u.apel1, ' ', IFNULL(u.apel2, '')) AS organizador_nombre,
      u.usuario AS organizador_usuario,
      u.imagen_perfil AS organizador_imagen,
      u.id_usuario AS organizador_id,
      c.categoria AS categoria_nombre,
      c.color AS categoria_color,
      COUNT(DISTINCT pe.id_usuario) AS participantes_actuales,
      COUNT(DISTINCT el.id_usuario) AS total_likes
    FROM eventos e
    JOIN usuarios u ON e.id_usuario = u.id_usuario
    LEFT JOIN eventos_categorias ec ON e.id_evento = ec.id_evento
    LEFT JOIN categorias c ON ec.id_categoria = c.id_categoria
    LEFT JOIN participantes_eventos pe ON e.id_evento = pe.id_evento
    LEFT JOIN eventos_likes el ON e.id_evento = el.id_evento
    GROUP BY e.id_evento, e.id_usuario, e.titulo, e.fecha, e.hora, e.descripcion,
             e.edad_min, e.edad_max, e.ubicacion, e.lat, e.lng, e.max_participantes,
             e.imagen, e.created_at, e.updated_at, u.nombre, u.apel1, u.apel2,
             u.usuario, u.imagen_perfil, u.id_usuario, c.categoria, c.color
    ORDER BY e.created_at DESC
    LIMIT ?`,
    [limit]
  );
  return rows;
};

/**
 * Obtener evento por ID con información completa
 */
export const getEventById = async (id: number, userId?: number): Promise<EventDetail | null> => {
  const [rows] = await dbPool.execute<RowDataPacket[]>(
    `SELECT 
      e.*,
      CONCAT(u.nombre, ' ', u.apel1, ' ', IFNULL(u.apel2, '')) AS organizador_nombre,
      u.usuario AS organizador_usuario,
      u.imagen_perfil AS organizador_imagen,
      u.id_usuario AS organizador_id,
      c.categoria AS categoria_nombre,
      c.color AS categoria_color,
      (SELECT COUNT(*) FROM participantes_eventos pe WHERE pe.id_evento = e.id_evento) AS participantes_actuales,
      (SELECT COUNT(*) FROM eventos_likes el WHERE el.id_evento = e.id_evento) AS total_likes
      ${userId ? `,
      EXISTS(SELECT 1 FROM participantes_eventos pe WHERE pe.id_evento = e.id_evento AND pe.id_usuario = ?) AS is_participant,
      EXISTS(SELECT 1 FROM eventos_likes el WHERE el.id_evento = e.id_evento AND el.id_usuario = ?) AS liked_by_user` : ''}
    FROM eventos e
    JOIN usuarios u ON e.id_usuario = u.id_usuario
    LEFT JOIN eventos_categorias ec ON e.id_evento = ec.id_evento
    LEFT JOIN categorias c ON ec.id_categoria = c.id_categoria
    WHERE e.id_evento = ?`,
    userId ? [userId, userId, id] : [id]
  );

  return rows.length > 0 ? (rows[0] as EventDetail) : null;
};

/**
 * Crear evento
 */
export const createEvent = async (
  eventData: EventCreateInput,
  userId: number,
  imagePath?: string
): Promise<number> => {
  const [result] = await dbPool.execute<ResultSetHeader>(
    `INSERT INTO eventos 
     (id_usuario, titulo, fecha, hora, descripcion, edad_min, edad_max, ubicacion, lat, lng, max_participantes, imagen)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      eventData.titulo,
      eventData.fecha,
      eventData.hora,
      eventData.descripcion,
      eventData.edad_min,
      eventData.edad_max,
      eventData.ubicacion,
      eventData.lat || null,
      eventData.lng || null,
      eventData.max_participantes,
      imagePath || null,
    ]
  );

  const eventId = result.insertId;

  // Añadir categoría al evento
  await dbPool.execute(
    'INSERT INTO eventos_categorias (id_evento, id_categoria) VALUES (?, ?)',
    [eventId, eventData.id_categoria]
  );

  return eventId;
};

/**
 * Buscar eventos
 */
export const searchEvents = async (
  searchTerm?: string,
  categoryIds?: string
): Promise<any[]> => {
  let query = `
    SELECT
      e.id_evento,
      e.id_usuario,
      e.titulo,
      e.fecha,
      e.hora,
      e.descripcion,
      e.edad_min,
      e.edad_max,
      e.ubicacion,
      e.lat,
      e.lng,
      e.max_participantes,
      e.imagen,
      e.created_at,
      e.updated_at,
      CONCAT(u.nombre, ' ', u.apel1, ' ', IFNULL(u.apel2, '')) AS organizador_nombre,
      u.usuario AS organizador_usuario,
      u.imagen_perfil AS organizador_imagen,
      u.id_usuario AS organizador_id,
      c.categoria AS categoria_nombre,
      c.color AS categoria_color,
      COUNT(DISTINCT pe.id_usuario) AS participantes_actuales,
      COUNT(DISTINCT el.id_usuario) AS total_likes
    FROM eventos e
    JOIN usuarios u ON e.id_usuario = u.id_usuario
    LEFT JOIN eventos_categorias ec ON e.id_evento = ec.id_evento
    LEFT JOIN categorias c ON ec.id_categoria = c.id_categoria
    LEFT JOIN participantes_eventos pe ON e.id_evento = pe.id_evento
    LEFT JOIN eventos_likes el ON e.id_evento = el.id_evento
    WHERE 1=1
  `;

  const params: any[] = [];

  // Filtro por término de búsqueda
  if (searchTerm) {
    query += ` AND (e.titulo LIKE ? OR e.descripcion LIKE ? OR e.ubicacion LIKE ?)`;
    const searchPattern = `%${searchTerm}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  // Filtro por categorías
  if (categoryIds) {
    const categoryArray = categoryIds.split(',').map(id => parseInt(id.trim()));
    query += ` AND ec.id_categoria IN (${categoryArray.map(() => '?').join(',')})`;
    params.push(...categoryArray);
  }

  query += `
    GROUP BY e.id_evento, e.id_usuario, e.titulo, e.fecha, e.hora, e.descripcion,
             e.edad_min, e.edad_max, e.ubicacion, e.lat, e.lng, e.max_participantes,
             e.imagen, e.created_at, e.updated_at, u.nombre, u.apel1, u.apel2,
             u.usuario, u.imagen_perfil, u.id_usuario, c.categoria, c.color
    ORDER BY e.fecha ASC
  `;

  const [rows] = await dbPool.execute<RowDataPacket[]>(query, params);
  return rows;
};

/**
 * Unirse a un evento
 */
export const joinEvent = async (eventId: number, userId: number): Promise<void> => {
  await dbPool.execute(
    'INSERT IGNORE INTO participantes_eventos (id_evento, id_usuario) VALUES (?, ?)',
    [eventId, userId]
  );
};

/**
 * Salir de un evento
 */
export const leaveEvent = async (eventId: number, userId: number): Promise<void> => {
  await dbPool.execute(
    'DELETE FROM participantes_eventos WHERE id_evento = ? AND id_usuario = ?',
    [eventId, userId]
  );
};

/**
 * Dar like a un evento
 */
export const likeEvent = async (eventId: number, userId: number): Promise<void> => {
  await dbPool.execute(
    'INSERT IGNORE INTO eventos_likes (id_evento, id_usuario) VALUES (?, ?)',
    [eventId, userId]
  );
};

/**
 * Quitar like de un evento
 */
export const unlikeEvent = async (eventId: number, userId: number): Promise<void> => {
  await dbPool.execute(
    'DELETE FROM eventos_likes WHERE id_evento = ? AND id_usuario = ?',
    [eventId, userId]
  );
};

/**
 * Obtener participantes de un evento
 */
export const getEventParticipants = async (eventId: number): Promise<any[]> => {
  const [rows] = await dbPool.execute<RowDataPacket[]>(
    `SELECT u.id_usuario, u.usuario, u.nombre, u.apel1, u.apel2, u.imagen_perfil,
            CONCAT(u.nombre, ' ', u.apel1, ' ', IFNULL(u.apel2, '')) AS nombre_completo
     FROM participantes_eventos pe
     JOIN usuarios u ON pe.id_usuario = u.id_usuario
     WHERE pe.id_evento = ?`,
    [eventId]
  );
  return rows;
};
