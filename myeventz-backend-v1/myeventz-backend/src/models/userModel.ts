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
