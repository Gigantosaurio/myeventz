import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { dbPool } from '../config/database';
import { User, UserRegisterInput } from '../types';

/**
 * Buscar usuario por username
 */
export const findUserByUsername = async (usuario: string): Promise<User | null> => {
  const [rows] = await dbPool.execute<RowDataPacket[]>(
    'SELECT * FROM usuarios WHERE usuario = ?',
    [usuario]
  );
  return rows.length > 0 ? (rows[0] as User) : null;
};

/**
 * Buscar usuario por ID
 */
export const findUserById = async (id: number): Promise<User | null> => {
  const [rows] = await dbPool.execute<RowDataPacket[]>(
    'SELECT * FROM usuarios WHERE id_usuario = ?',
    [id]
  );
  return rows.length > 0 ? (rows[0] as User) : null;
};

/**
 * Crear nuevo usuario
 */
export const createUser = async (userData: UserRegisterInput, hashedPassword: string): Promise<number> => {
  const [result] = await dbPool.execute<ResultSetHeader>(
    `INSERT INTO usuarios (usuario, clave, nombre, apel1, apel2, f_nac, bio)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userData.usuario,
      hashedPassword,
      userData.nombre,
      userData.apel1,
      userData.apel2 || null,
      userData.f_nac,
      userData.bio || null,
    ]
  );
  return result.insertId;
};

/**
 * Actualizar usuario
 */
export const updateUser = async (
  id: number,
  userData: {
    nombre?: string;
    apel1?: string;
    apel2?: string;
    bio?: string;
    ig?: string;
    fb?: string;
    x?: string;
    yt?: string;
    tt?: string;
  }
): Promise<boolean> => {
  const fields: string[] = [];
  const values: any[] = [];

  if (userData.nombre !== undefined) {
    fields.push('nombre = ?');
    values.push(userData.nombre);
  }
  if (userData.apel1 !== undefined) {
    fields.push('apel1 = ?');
    values.push(userData.apel1);
  }
  if (userData.apel2 !== undefined) {
    fields.push('apel2 = ?');
    values.push(userData.apel2);
  }
  if (userData.bio !== undefined) {
    fields.push('bio = ?');
    values.push(userData.bio);
  }
  if (userData.ig !== undefined) {
    fields.push('ig = ?');
    values.push(userData.ig);
  }
  if (userData.fb !== undefined) {
    fields.push('fb = ?');
    values.push(userData.fb);
  }
  if (userData.x !== undefined) {
    fields.push('x = ?');
    values.push(userData.x);
  }
  if (userData.yt !== undefined) {
    fields.push('yt = ?');
    values.push(userData.yt);
  }
  if (userData.tt !== undefined) {
    fields.push('tt = ?');
    values.push(userData.tt);
  }

  if (fields.length === 0) return false;

  values.push(id);

  const [result] = await dbPool.execute<ResultSetHeader>(
    `UPDATE usuarios SET ${fields.join(', ')} WHERE id_usuario = ?`,
    values
  );

  return result.affectedRows > 0;
};

/**
 * Actualizar imagen de perfil
 */
export const updateProfilePicture = async (
  id: number,
  imageUrl: string
): Promise<boolean> => {
  const [result] = await dbPool.execute<ResultSetHeader>(
    'UPDATE usuarios SET imagen_perfil = ? WHERE id_usuario = ?',
    [imageUrl, id]
  );
  return result.affectedRows > 0;
};

/**
 * Obtener hobbies de un usuario
 */
export const getUserHobbies = async (userId: number): Promise<any[]> => {
  const [rows] = await dbPool.execute<RowDataPacket[]>(
    `SELECT c.* FROM usuarios_hobbies uh
     JOIN categorias c ON uh.id_categoria = c.id_categoria
     WHERE uh.id_usuario = ?`,
    [userId]
  );
  return rows;
};

/**
 * Añadir hobbies a un usuario
 */
export const addUserHobbies = async (userId: number, hobbies: number[]): Promise<void> => {
  if (hobbies.length === 0) return;

  const values = hobbies.map((categoryId) => [userId, categoryId]);
  await dbPool.query(
    'INSERT IGNORE INTO usuarios_hobbies (id_usuario, id_categoria) VALUES ?',
    [values]
  );
};

/**
 * Actualizar hobbies de un usuario (elimina los antiguos y añade los nuevos)
 */
export const updateUserHobbies = async (userId: number, hobbies: number[]): Promise<void> => {
  // Eliminar hobbies existentes
  await dbPool.execute('DELETE FROM usuarios_hobbies WHERE id_usuario = ?', [userId]);

  // Añadir nuevos hobbies
  if (hobbies.length > 0) {
    const values = hobbies.map((categoryId) => [userId, categoryId]);
    await dbPool.query(
      'INSERT INTO usuarios_hobbies (id_usuario, id_categoria) VALUES ?',
      [values]
    );
  }
};

/**
 * Buscar usuarios (para búsqueda)
 */
export const searchUsers = async (query: string): Promise<any[]> => {
  const searchTerm = `%${query}%`;
  const [rows] = await dbPool.execute<RowDataPacket[]>(
    `SELECT u.id_usuario, u.usuario, u.nombre, u.apel1, u.apel2, u.f_nac, 
            u.bio, u.imagen_perfil, u.created_at,
            CONCAT(u.nombre, ' ', u.apel1, ' ', IFNULL(u.apel2, '')) AS nombre_completo
     FROM usuarios u
     WHERE u.usuario LIKE ? OR CONCAT(u.nombre, ' ', u.apel1, ' ', IFNULL(u.apel2, '')) LIKE ?
     LIMIT 20`,
    [searchTerm, searchTerm]
  );
  return rows;
};

/**
 * Obtener eventos organizados por un usuario
 */
export const getUserOrganizedEvents = async (userId: number): Promise<any[]> => {
  const [rows] = await dbPool.execute<RowDataPacket[]>(
    `SELECT e.*,
            c.categoria AS categoria_nombre,
            c.color AS categoria_color,
            (SELECT COUNT(*) FROM participantes_eventos pe WHERE pe.id_evento = e.id_evento) AS participantes_actuales,
            (SELECT COUNT(*) FROM eventos_likes el WHERE el.id_evento = e.id_evento) AS total_likes
     FROM eventos e
     LEFT JOIN eventos_categorias ec ON e.id_evento = ec.id_evento
     LEFT JOIN categorias c ON ec.id_categoria = c.id_categoria
     WHERE e.id_usuario = ?
     ORDER BY e.fecha DESC`,
    [userId]
  );
  return rows;
};

/**
 * Obtener eventos en los que participa un usuario
 */
export const getUserParticipatingEvents = async (userId: number): Promise<any[]> => {
  const [rows] = await dbPool.execute<RowDataPacket[]>(
    `SELECT e.*,
            CONCAT(u.nombre, ' ', u.apel1, ' ', IFNULL(u.apel2, '')) AS organizador_nombre,
            u.usuario AS organizador_usuario,
            c.categoria AS categoria_nombre,
            c.color AS categoria_color,
            (SELECT COUNT(*) FROM participantes_eventos pe WHERE pe.id_evento = e.id_evento) AS participantes_actuales,
            (SELECT COUNT(*) FROM eventos_likes el WHERE el.id_evento = e.id_evento) AS total_likes
     FROM participantes_eventos pe
     JOIN eventos e ON pe.id_evento = e.id_evento
     JOIN usuarios u ON e.id_usuario = u.id_usuario
     LEFT JOIN eventos_categorias ec ON e.id_evento = ec.id_evento
     LEFT JOIN categorias c ON ec.id_categoria = c.id_categoria
     WHERE pe.id_usuario = ?
     ORDER BY e.fecha DESC`,
    [userId]
  );
  return rows;
};

/**
 * Obtener usuario con estadísticas completas
 */
export const getUserWithStats = async (userId: number): Promise<any | null> => {
  const user = await findUserById(userId);
  if (!user) return null;

  // Eliminar password
  delete user.clave;

  // Obtener hobbies
  const hobbies = await getUserHobbies(userId);

  // Contar eventos
  const [statsRows] = await dbPool.execute<RowDataPacket[]>(
    `SELECT 
      (SELECT COUNT(*) FROM eventos WHERE id_usuario = ?) AS eventos_organizados,
      (SELECT COUNT(*) FROM participantes_eventos WHERE id_usuario = ?) AS eventos_participando`,
    [userId, userId]
  );

  const stats = statsRows[0];

  return {
    ...user,
    hobbies,
    eventos_organizados: stats.eventos_organizados,
    eventos_participando: stats.eventos_participando,
  };
};

/**
 * Obtener eventos que le gustan a un usuario
 */
export const getUserLikedEvents = async (userId: number): Promise<any[]> => {
  const [rows] = await dbPool.execute<RowDataPacket[]>(
    `SELECT
      e.id_evento, e.id_usuario, e.titulo, e.fecha, e.hora,
      e.descripcion, e.edad_min, e.edad_max, e.ubicacion,
      e.lat, e.lng, e.max_participantes, e.imagen,
      e.created_at, e.updated_at,
      CONCAT(u.nombre, ' ', u.apel1, ' ', IFNULL(u.apel2, '')) AS organizador_nombre,
      u.usuario AS organizador_usuario,
      u.imagen_perfil AS organizador_imagen,
      u.id_usuario AS organizador_id,
      c.categoria AS categoria_nombre,
      c.color AS categoria_color,
      COUNT(DISTINCT pe.id_usuario) AS participantes_actuales,
      COUNT(DISTINCT el2.id_usuario) AS total_likes,
      1 AS liked_by_user
    FROM eventos_likes el
    JOIN eventos e ON el.id_evento = e.id_evento
    JOIN usuarios u ON e.id_usuario = u.id_usuario
    LEFT JOIN eventos_categorias ec ON e.id_evento = ec.id_evento
    LEFT JOIN categorias c ON ec.id_categoria = c.id_categoria
    LEFT JOIN participantes_eventos pe ON e.id_evento = pe.id_evento
    LEFT JOIN eventos_likes el2 ON e.id_evento = el2.id_evento
    WHERE el.id_usuario = ?
    GROUP BY e.id_evento, e.id_usuario, e.titulo, e.fecha, e.hora, e.descripcion,
             e.edad_min, e.edad_max, e.ubicacion, e.lat, e.lng, e.max_participantes,
             e.imagen, e.created_at, e.updated_at, u.nombre, u.apel1, u.apel2,
             u.usuario, u.imagen_perfil, u.id_usuario, c.categoria, c.color
    ORDER BY el.created_at DESC`,
    [userId]
  );
  return rows;
};
